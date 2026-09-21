import { getProfileImagePresignedUrl } from "./auth";
import api from "./axios";

// 이미지 업로드를 위해 백엔드에게 presigned URL을 요청하는 함수
export const getImagePresignedUrl = async (
  prefix: string,
  fileName: string,
) => {
  const response = await api.get<string>("/images/presigned-url", {
    params: {
      prefix,
      fileName,
    },
  });
  // 문자열 반환
  return response.data;
};

// presigned URL을 사용하여 실제 이미지를 S3에 업로드하는 함수
export const uploadImageToS3 = async (
  presignedUrl: string,
  imageUri: string,
  contentType = "image/jpeg",
) => {
  // 로컬 imageUri을 가져와서 Blob으로 변환
  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();

  // S3에 이미지 업로드 요청
  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: imageBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error("이미지 업로드에 실패했습니다");
  }
};

// 전체 이미지 업로드 프로세스를 처리하는 함수
// 실제 이미지 업로드 시에, 이 함수를 사용하여 한 번에 처리합니다.
export const uploadImage = async (
  imageUri: string,
  fileName: string,
  prefix = "reviews",
  contentType = "image/jpeg",
) => {
  const presignedUrl = await getImagePresignedUrl(prefix, fileName);

  await uploadImageToS3(presignedUrl, imageUri, contentType);

  // 서버 S3 설정은 path-style URL(`/버킷명/objectKey`)을 사용한다.
  const [, ...objectKeySegments] = decodeURIComponent(
    new URL(presignedUrl).pathname,
  )
    .split("/")
    .filter(Boolean);

  const objectKey = objectKeySegments.join("/");
  if (!objectKey) {
    throw new Error("업로드한 이미지의 object key를 찾을 수 없습니다.");
  }

  return objectKey;
};

// 프로필 이미지는 전용 API가 반환한 objectKey를 그대로 사용한다.
export const uploadProfileImage = async (
  source: { uri: string; fileName?: string | null; mimeType?: string | null } | string,
  fileName?: string,
  mimeType?: string,
) => {
  const image = typeof source === "string"
    ? { uri: source, fileName, mimeType }
    : source;
  const imageResponse = await fetch(image.uri);
  const imageBlob = await imageResponse.blob();
  const contentType = imageBlob.type || image.mimeType;
  if (!contentType || imageBlob.size === 0) {
    throw new Error("이미지 형식 또는 크기를 확인할 수 없습니다.");
  }
  const extension = contentType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const res = await getProfileImagePresignedUrl({
    fileName: image.fileName || `profile_${Date.now()}.${extension}`,
    contentType,
    fileSize: imageBlob.size,
  });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.error?.message || "이미지 업로드 URL 발급에 실패했습니다.");
  }
  const { presignedUrl, objectKey, contentType: uploadContentType } = res.data.data;
  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": uploadContentType },
    body: imageBlob,
  });
  if (!uploadResponse.ok) throw new Error("이미지 업로드에 실패했습니다.");
  return objectKey;
};

// 파일 이름과 MIME 타입을 기반으로 파일 정보를 반환하는 유틸리티 함수
export const getImageFileInfo = (
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
  fallbackBaseName: string,
) => {
  const resolvedMimeType = mimeType ?? "image/jpeg";

  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };

  const fallbackExtension = extensionMap[resolvedMimeType] ?? "jpg";

  if (!fileName) {
    return {
      fileName: `${fallbackBaseName}.${fallbackExtension}`,
      mimeType: resolvedMimeType,
    };
  }

  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  return {
    fileName: `${fileNameWithoutExtension}.${fallbackExtension}`,
    mimeType: resolvedMimeType,
  };
};

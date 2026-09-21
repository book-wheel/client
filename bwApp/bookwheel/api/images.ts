import api from "./axios";

type PresignedUrlResponse = {
  success: boolean;
  data: {
    presignedUrl: string;
    objectKey: string;
  };
  error: {
    code: string;
    message: string;
  } | null;
};

type ProfileImagePresignedResponse = {
  success: boolean;
  data: {
    presignedUrl: string;
    objectKey: string;
    contentType: string;
  };
  error: {
    code: string;
    message: string;
  } | null;
};

// 기존 이미지 업로드용 Presigned URL 요청 함수
export const getImagePresignedUrl = async (
  prefix: string,
  fileName: string,
) => {
  const response = await api.get<PresignedUrlResponse>(
    "/images/presigned-url",
    {
      params: {
        prefix,
        fileName,
      },
    },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? "이미지 업로드 URL 발급에 실패했습니다.",
    );
  }

  return response.data.data;
};

// 프로필 이미지 업로드용 Presigned URL 요청 함수
export const getProfileImagePresignedUrl = async (
  fileName: string,
  contentType: string,
  fileSize: number,
) => {
  const response = await api.post<ProfileImagePresignedResponse>(
    "/users/profile-image/presigned-url",
    {
      fileName,
      contentType,
      fileSize,
    },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ??
        "프로필 이미지 업로드 URL 발급에 실패했습니다.",
    );
  }

  return response.data.data;
};

// presigned URL을 사용하여 실제 이미지를 S3에 업로드하는 함수
export const uploadImageToS3 = async (
  presignedUrl: string,
  imageUri: string,
  contentType = "image/jpeg",
) => {
  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();

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

// 프로필 이미지 전체 업로드 프로세스
export const uploadProfileImage = async (
  imageUri: string,
  fileName: string,
  contentType = "image/jpeg",
) => {
  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();

  const { presignedUrl, objectKey } = await getProfileImagePresignedUrl(
    fileName,
    contentType,
    imageBlob.size,
  );

  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: imageBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error("프로필 이미지 업로드에 실패했습니다");
  }

  return objectKey;
};

// 기존 일반 이미지 업로드 프로세스
export const uploadImage = async (
  imageUri: string,
  fileName: string,
  prefix = "reviews",
  contentType = "image/jpeg",
) => {
  const { presignedUrl, objectKey } = await getImagePresignedUrl(
    prefix,
    fileName,
  );

  await uploadImageToS3(presignedUrl, imageUri, contentType);

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

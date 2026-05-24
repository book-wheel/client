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

  // 실제 objectKey 반환
  const objectKey = decodeURIComponent(
    new URL(presignedUrl).pathname.replace(/^\/+/, ""),
  );

  return objectKey;
};

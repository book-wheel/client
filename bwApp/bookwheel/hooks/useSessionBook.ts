export function useSessionBook() {
  const groupId = "1";

  const bookOwner = {
    name: "김주옥",
    comment: "차갑지만 묘하게 따뜻한 이야기예요\n재밌게 읽어주세요!",
    details: "21페이지 찢김",
  };

  return {
    groupId,
    bookOwner,
  };
}

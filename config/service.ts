export const SERVICE_NAME = process.env.SERVICE_NAME?.trim() || "식방";
export const SERVICE_END_DATE =
  process.env.SERVICE_END_DATE?.trim() || "2026년 9월 16일";
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL?.trim() || "contact.sigbang@gmail.com";
export const SERVICE_END_PAGE_NOINDEX =
  process.env.SERVICE_END_PAGE_NOINDEX === "true";
export const PERSONAL_DATA_DELETION_NOTICE =
  "서비스 종료에 따라 불필요해진 개인정보는 지체 없이 파기하겠습니다. 법령상 보존 의무가 있는 정보는 해당 기간 동안 분리 보관하며, 파기 완료 후 이 페이지에 안내하겠습니다.";

if (CONTACT_EMAIL && !/^[^\s@<>"?&#]+@[^\s@<>"?&#]+\.[^\s@<>"?&#]+$/.test(CONTACT_EMAIL)) {
  throw new Error("CONTACT_EMAIL must be a valid plain email address.");
}

// All visible notice copy is maintained here.
export const service = {
  name: SERVICE_NAME,
  title: `${SERVICE_NAME} 서비스 종료 안내`,
  description: `${SERVICE_NAME} 서비스 종료에 대한 안내 페이지입니다.`,
  label: "서비스 종료 안내",
  paragraphs: [
    `${SERVICE_NAME} 서비스를 이용해 주셔서 감사합니다.`,
    `${SERVICE_NAME}은 ${SERVICE_END_DATE}부로 서비스를 종료하였습니다.`,
    `그동안 ${SERVICE_NAME}을 이용해 주신 모든 분께 진심으로 감사드립니다.`,
    PERSONAL_DATA_DELETION_NOTICE,
    "서비스 종료와 관련된 문의는 아래 이메일을 이용해 주세요.",
  ],
  contactLabel: "문의",
  contactEmail: CONTACT_EMAIL,
  contactPending: "문의 이메일 준비 중입니다.",
  copyright: `© ${SERVICE_NAME}. All rights reserved.`,
  goneTitle: "페이지를 더 이상 제공하지 않습니다.",
  goneDescription: `${SERVICE_NAME} 서비스가 종료되어 기존 콘텐츠는 더 이상 제공되지 않습니다.`,
  homeLink: "서비스 종료 안내 보기",
  privacyLink: "개인정보 처리 안내 및 기존 방침",
};

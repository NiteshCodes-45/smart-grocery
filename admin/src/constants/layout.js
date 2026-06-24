export const EXPANDED_SIDEBAR_WIDTH = 260;
export const COLLAPSED_SIDEBAR_WIDTH = 76;

export const getSidebarWidth = (collapsed) => (collapsed ? COLLAPSED_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH);

// ============================================================
// BREADCRUMB COMPONENT
// ============================================================

export function createBreadcrumb(text) {
  const bc = document.createElement('div');
  bc.className = 'breadcrumb';
  bc.innerHTML = text;
  return bc;
}

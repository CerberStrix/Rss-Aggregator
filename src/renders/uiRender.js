export default (state) => {
  const anchors = document.querySelectorAll('a');
  anchors.forEach((anchor) => {
    if (state.uiState.shownPosts.includes(anchor.dataset.id)) {
      anchor.classList.remove('fw-bold');
      anchor.classList.add('fw-normal');
      anchor.classList.add('link-secondary');
    } else {
      anchor.classList.remove('fw-normal');
      anchor.classList.add('fw-bold');
      anchor.classList.remove('link-secondary');
    }
  });
};

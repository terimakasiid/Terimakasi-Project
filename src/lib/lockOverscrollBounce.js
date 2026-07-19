// Kunci rubber-band/elastic bounce scroll ala native app, khusus buat
// nutup celah di iOS Safari yang belum full support CSS overscroll-behavior.
//
// Caranya: setiap kali user nge-drag (touchmove), cek elemen yang lagi
// disentuh ada di dalam container scrollable (.overflow-y-auto/.overflow-x-auto)
// apa enggak. Kalau enggak ada sama sekali container yang bisa discroll di
// bawah jarinya, ATAU dia lagi narik pas container itu udah mentok di ujung
// atas/bawah, batalin default browser (yang biasanya munculin efek pantul).
export function lockOverscrollBounce() {
  let startY = 0;
  let startX = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length !== 1) return;

      const scrollableY = e.target.closest(".overflow-y-auto");
      const scrollableX = e.target.closest(".overflow-x-auto");
      const scrollable = scrollableY || scrollableX;

      if (!scrollable) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;

      if (scrollableY) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableY;
        const goingDown = touchY < startY; // jari narik ke atas = konten scroll ke bawah
        const goingUp = touchY > startY;
        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
        if ((atTop && goingUp) || (atBottom && goingDown)) {
          e.preventDefault();
        }
        return;
      }

      if (scrollableX) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollableX;
        const goingRight = touchX < startX;
        const goingLeft = touchX > startX;
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;
        if ((atStart && goingLeft) || (atEnd && goingRight)) {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );
}

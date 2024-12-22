function updateTooltips() {
    document.querySelectorAll("a[href^='/w/사용자:']").forEach(item => {
        if (!item.nextElementSibling || !item.nextElementSibling.classList.contains('tooltip-inner')) {
            const popover = document.createElement('div');
            popover.style.display = 'none';
            popover.style.zIndex = 9999;
            popover.style.position = 'absolute';
            popover.style.top = '25px';
            popover.style.left = '50%';
            popover.style.transform = 'translateX(-50%)';
            popover.innerHTML = `
            <div class="tooltip-inner popover-inner" style="align-items: center; display: flex; gap: 0.5rem; position: relative; background: #f9f9f9; border-radius: 5px; box-shadow: 0 5px 30px rgba(0, 0, 0, .2); color: #000; padding: 16px;">
                <a href="/contribution/author/${item.textContent}/document" class="btn btn-secondary btn-sm rectangular-button">기여내역</a>
                <a href="${item.href}" class="btn btn-primary btn-sm rectangular-button">사용자 문서</a>
                <button class="btn btn-danger btn-sm rectangular-button" onclick="showAclGroupModal('${item.textContent}', '${item.href}')">차단</button>
            </div>
            <style>
                .rectangular-button {
                    border-radius: 0;
                    padding: 3px 10px;
                    font-size: 14px;
                }
            </style>
            <div class="tooltip-arrow popover-arrow" style="border-style: solid; height: 0; margin: 5px; position: absolute; width: 0; z-index: 1; border-width: 0 5px 5px; right: 50%; transform: translateX(50%); margin-bottom: 0; margin-top: 0; top: -5px; border-left-color: transparent !important; border-right-color: transparent !important; border-top-color: transparent !important; border-color: #f9f9f9;"></div>`;
            item.setAttribute('onclick', "$(this).next().fadeToggle('fast'); return false;");
            item.parentElement.style.position = 'relative';
            item.after(popover);
        }
    });
}
}
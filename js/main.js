// Toast Notification Logic
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.className = "show";
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// Confirm Modal Logic
let currentTargetUrl = '';
function showConfirmModal(event, projectName, url) {
    event.preventDefault(); // 阻止默认的 <a> 标签跳转
    currentTargetUrl = url;
    const confirmDesc = document.getElementById("confirm-desc");
    const confirmModal = document.getElementById("confirm-modal");
    if (confirmDesc && confirmModal) {
        confirmDesc.innerText = `是否跳转进入【${projectName}】作品页面？`;
        confirmModal.classList.add("show");
    }
}

function closeConfirmModal() {
    const confirmModal = document.getElementById("confirm-modal");
    if (confirmModal) {
        confirmModal.classList.remove("show");
    }
    currentTargetUrl = '';
}

document.addEventListener("DOMContentLoaded", function() {
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function() {
            if (currentTargetUrl) {
                window.location.href = currentTargetUrl;
            }
        });
    }
});

// Accordion Toggle Logic
function toggleAccordion(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
}

// Lightbox Logic for Article Images
document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const zoomableImages = document.querySelectorAll('.zoomable-image');

    if (lightbox && lightboxImg && zoomableImages.length > 0) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.classList.add('show');
                lightboxImg.src = this.src;
                // 获取图片下方的说明文字
                const caption = this.nextElementSibling;
                if (caption && caption.classList.contains('image-caption')) {
                    lightboxCaption.innerHTML = caption.innerHTML;
                } else {
                    lightboxCaption.innerHTML = this.alt || '';
                }
            });
        });
    }
});

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
    }
}

window.initNavbar = function() {
    const mobileBtn = document.getElementById("mobileBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuIcon = document.getElementById("mobileMenuIcon");

    if (mobileBtn && mobileMenu) {
        const newBtn = mobileBtn.cloneNode(true);
        mobileBtn.parentNode.replaceChild(newBtn, mobileBtn);
        
        document.getElementById("mobileBtn").addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("hidden");
            if(mobileMenuIcon) {
                mobileMenuIcon.classList.toggle("fa-bars");
                mobileMenuIcon.classList.toggle("fa-xmark");
            }
        });
    }

    function setupMobileAccordion(toggleId, subId, arrowId) {
        const toggleBtn = document.getElementById(toggleId);
        const subMenu = document.getElementById(subId);
        const arrow = document.getElementById(arrowId);

        if (toggleBtn && subMenu) {
            const newToggle = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

            document.getElementById(toggleId).addEventListener("click", () => {
                subMenu.classList.toggle("hidden");
                const activeArrow = document.getElementById(arrowId);
                if (activeArrow) activeArrow.classList.toggle("rotate-180");
            });
        }
    }

    setupMobileAccordion("mobileServicesToggle", "mobileServicesSub", "mobileServicesArrow");
    setupMobileAccordion("mobileIndustryToggle", "mobileIndustriesSub", "mobileIndustryArrow");

    function setupDropdownHover(menuId, dropdownId, arrowId) {
        const menu = document.getElementById(menuId);
        const dropdown = document.getElementById(dropdownId);
        const arrow = document.getElementById(arrowId);

        if (menu && dropdown) {
            let hideTimeout;

            menu.addEventListener("mouseenter", () => {
                clearTimeout(hideTimeout);
                dropdown.classList.remove("opacity-0", "invisible", "translate-y-3");
                dropdown.classList.add("opacity-100");
                if (arrow) arrow.classList.add("rotate-180");
            });

            menu.addEventListener("mouseleave", () => {
                hideTimeout = setTimeout(() => {
                    dropdown.classList.add("opacity-0", "invisible", "translate-y-3");
                    dropdown.classList.remove("opacity-100");
                    if (arrow) arrow.classList.remove("rotate-180");
                }, 150);
            });

            dropdown.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
            dropdown.addEventListener("mouseleave", () => {
                hideTimeout = setTimeout(() => {
                    dropdown.classList.add("opacity-0", "invisible", "translate-y-3");
                    dropdown.classList.remove("opacity-100");
                    if (arrow) arrow.classList.remove("rotate-180");
                }, 150);
            });
        }
    }

    setupDropdownHover("servicesMenu", "servicesDropdown", "servicesArrow");
    setupDropdownHover("industryMenu", "industryDropdown", "industryArrow");
};

document.addEventListener("DOMContentLoaded", () => {
    window.initNavbar();
});
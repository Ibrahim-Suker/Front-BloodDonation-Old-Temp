/* ----------------------------------------------------------------
    ملف JavaScript الرئيسي - Blood Buddies
    يحتوي على تفعيل المكتبات والأنيميشن + منطق البحث (Donors)
----------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تفعيل مكتبة AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 2. تفعيل مكتبة GLightbox
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });

    // 3. تفعيل سلايدر آراء العملاء
    var testimonialSwiper = new Swiper(".testimonialSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 768: { slidesPerView: 2 } }
    });

    // 4. تفعيل سلايدر الحملات
    var campaignSwiper = new Swiper(".campaignSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    // 5. عداد الأرقام
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };
    let counterSection = document.querySelector("#counter-section");
    if (counterSection) {
        let options = { rootMargin: '0px', threshold: 0.5 };
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        observer.observe(counterSection);
    }

    // 6. تأثير الناف بار
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });

    // 7. التعامل مع فورم طلب الدم (Request Blood)
    const requestForm = document.querySelector('form:not(#searchForm)'); 
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            /* [BACKEND NOTE]: 
               This is a static success message.
               Connect this form to API endpoint (e.g., POST /api/requests/create).
            */
            e.preventDefault();
            alert('Your request has been submitted successfully!');
            this.reset();
        });
    }

    // 8. تفاعلية قسم طرق التبرع
    const methodItems = document.querySelectorAll('.method-item');
    if (methodItems.length > 0) {
        methodItems.forEach(item => {
            item.addEventListener('click', function() {
                methodItems.forEach(el => el.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // 9. سلايدر الرعاة
    var sponsorsSwiper = new Swiper(".sponsorsSwiper", {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: { delay: 3000, disableOnInteraction: false },
        breakpoints: {
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
        },
    });

    /* ----------------------------------------------------------------
       10. نظام البحث والفلترة (DONOR SEARCH SYSTEM)
    ----------------------------------------------------------------- */
    
    /* [BACKEND API INTEGRATION - TODO]
       1. This 'donorsData' array is MOCK DATA for frontend demo.
       2. Replace it with an Async function to fetch data from API: 
          e.g., const response = await fetch('/api/donors/get-all');
       3. Ensure API response matches this JSON structure:
          { name: string, group: string, country: string, city: string, img: string }
    */
    const donorsData = [
        { name: "Ahmed Ali", group: "A+", country: "Egypt", city: "Cairo", img: "images/user_1.jpg" },
        { name: "Sarah Smith", group: "O+", country: "USA", city: "New York", img: "images/user_2.jpg" },
        { name: "Michael Brown", group: "B-", country: "UK", city: "London", img: "images/user_3.jpg" },
        { name: "Emily Davis", group: "AB+", country: "USA", city: "California", img: "images/user_4.jpg" },
        { name: "Mohamed Salah", group: "O+", country: "Egypt", city: "Mansoura", img: "images/user_1.jpg" },
        { name: "John Doe", group: "A-", country: "USA", city: "New York", img: "images/user_3.jpg" },
        { name: "Mona Hassan", group: "B+", country: "Egypt", city: "Cairo", img: "images/user_2.jpg" },
        { name: "Khaled Waleed", group: "AB-", country: "Egypt", city: "Cairo", img: "images/user_4.jpg" }
    ];

    const donorGrid = document.getElementById('donorGrid');
    const searchForm = document.getElementById('searchForm');

    function renderDonors(donors) {
        if (!donorGrid) return; 
        
        donorGrid.innerHTML = ''; 

        if (donors.length === 0) {
            donorGrid.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fa-solid fa-face-frown fa-3x mb-3"></i>
                    <h3>No donors found matching your criteria.</h3>
                    <p>Try changing your search filter.</p>
                </div>`;
            return;
        }

        donors.forEach(donor => {
            const donorCard = `
                <div class="col-lg-3 col-md-6" data-aos="fade-up">
                    <div class="card h-100 border-0 shadow-sm text-center p-3">
                        <div class="position-relative mx-auto mb-3" style="width: 100px; height: 100px;">
                            <img src="${donor.img}" class="rounded-circle w-100 h-100 object-fit-cover" alt="${donor.name}">
                            <span class="position-absolute bottom-0 end-0 bg-theme text-white badge rounded-circle p-2 border border-2 border-white">${donor.group}</span>
                        </div>
                        <h5 class="fw-bold mb-1">${donor.name}</h5>
                        <p class="text-muted small mb-2"><i class="fa-solid fa-location-dot me-1"></i> ${donor.city}, ${donor.country}</p>
                        <div class="d-grid">
                            <a href="contact.html" class="btn btn-outline-dark btn-sm">Contact Donor</a>
                        </div>
                    </div>
                </div>
            `;
            donorGrid.innerHTML += donorCard;
        });
    }

    // تشغيل الدالة عند فتح الصفحة
    if (donorGrid) {
        renderDonors(donorsData);
    }

    // تشغيل الفلترة عند الضغط على زر البحث
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            /* [BACKEND API INTEGRATION - TODO]
               1. Collect values: selectedGroup, selectedCountry, selectedCity.
               2. Send GET Request with Query Params to Server:
                  GET /api/donors/search?group=${group}&country=${country}&city=${city}
               3. Receive filtered list from Server and call renderDonors(apiResponse).
            */

            const selectedGroup = document.getElementById('bloodGroup').value;
            const selectedCountry = document.getElementById('country').value;
            const selectedCity = document.getElementById('city').value;

            const filteredDonors = donorsData.filter(donor => {
                const matchGroup = selectedGroup === 'all' || donor.group === selectedGroup;
                const matchCountry = selectedCountry === 'all' || donor.country === selectedCountry;
                const matchCity = selectedCity === 'all' || donor.city === selectedCity;
                return matchGroup && matchCountry && matchCity;
            });

            renderDonors(filteredDonors);
        });
    }
});
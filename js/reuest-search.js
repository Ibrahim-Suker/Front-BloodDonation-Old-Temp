document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. تعريف البيانات (Data)
    // ==========================================

    // أ. بيانات الدول والمدن
    const locationData = {
        "Egypt": ["Cairo", "Giza", "Alexandria", "Mansoura", "Luxor", "Aswan"],
        "USA": ["New York", "California", "Texas", "Florida", "Washington"],
        "UK": ["London", "Manchester", "Liverpool", "Birmingham"],
        "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina"],
        "UAE": ["Dubai", "Abu Dhabi", "Sharjah"],
        "Germany": ["Berlin", "Munich", "Hamburg"]
    };

    // ب. بيانات المتبرعين (Dummy Data)
    const donorsData = [
        { id: 1, name: "Ahmed Mohamed", bloodGroup: "A+", country: "Egypt", city: "Cairo", gender: "male", lastDonation: "2 months ago" },
        { id: 2, name: "Sarah Jenkins", bloodGroup: "O-", country: "USA", city: "New York", gender: "female", lastDonation: "1 year ago" },
        { id: 3, name: "Omar Khaled", bloodGroup: "B+", country: "Egypt", city: "Mansoura", gender: "male", lastDonation: "Never" },
        { id: 4, name: "John Smith", bloodGroup: "AB+", country: "UK", city: "London", gender: "male", lastDonation: "3 months ago" },
        { id: 5, name: "Amira Hassan", bloodGroup: "O+", country: "Egypt", city: "Alexandria", gender: "female", lastDonation: "5 months ago" },
        { id: 6, name: "Michael Ross", bloodGroup: "A-", country: "USA", city: "California", gender: "male", lastDonation: "Just now" },
        { id: 7, name: "Ali Hassan", bloodGroup: "A+", country: "Egypt", city: "Cairo", gender: "male", lastDonation: "1 month ago" },
        { id: 8, name: "Emma Watson", bloodGroup: "B-", country: "UK", city: "Manchester", gender: "female", lastDonation: "6 months ago" }
    ];

    // ==========================================
    // 2. تعريف عناصر HTML
    // ==========================================
    const countrySelect = document.getElementById("country");
    const citySelect = document.getElementById("city");
    const bloodGroupSelect = document.getElementById("bloodGroup");
    const searchForm = document.getElementById("searchForm");
    const donorGrid = document.getElementById("donorGrid");

    // التأكد من وجود العناصر لتجنب الأخطاء
    if (countrySelect && citySelect && donorGrid && searchForm) {

        // ==========================================
        // 3. منطق القوائم المنسدلة (Cascading Dropdown)
        // ==========================================

        // ملء قائمة الدول
        for (let country in locationData) {
            let option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        }

        // تحديث المدن عند تغيير الدولة
        countrySelect.addEventListener("change", function () {
            const selectedCountry = this.value;
            
            // إعادة تعيين قائمة المدن
            citySelect.innerHTML = '<option value="all" selected>All Cities</option>'; // غيرتها لـ All Cities عشان البحث

            if (selectedCountry !== "all" && locationData[selectedCountry]) {
                const cities = locationData[selectedCountry];
                cities.forEach(function (city) {
                    let option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        });

        // ==========================================
        // 4. دالة عرض المتبرعين (Rendering)
        // ==========================================
        function renderDonors(donors) {
            donorGrid.innerHTML = ''; // مسح المحتوى القديم

            if (donors.length === 0) {
                donorGrid.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">No donors found matching your criteria.</h4></div>';
                return;
            }

            donors.forEach(donor => {
                const userImage = donor.gender === 'male' 
                    ? 'https://cdn-icons-png.flaticon.com/512/4128/4128176.png' 
                    : 'https://cdn-icons-png.flaticon.com/512/4128/4128244.png';

                const cardHTML = `
                    <div class="col-lg-4 col-md-6" data-aos="fade-up">
                        <div class="card h-100 border-0 shadow-sm text-center position-relative overflow-hidden user-card">
                            <div class="position-absolute top-0 end-0 bg-theme text-white px-3 py-2 rounded-bottom-start fw-bold" 
                                 style="border-bottom-left-radius: 15px !important; background-color: #ef3d32;">
                                ${donor.bloodGroup}
                            </div>
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <img src="${userImage}" alt="${donor.name}" class="rounded-circle border border-3 border-light shadow-sm" width="100" height="100">
                                </div>
                                <h5 class="card-title fw-bold text-dark">${donor.name}</h5>
                                <p class="text-muted small mb-3">
                                    <i class="fa-solid fa-location-dot text-theme me-1" style="color: #ef3d32;"></i> ${donor.city}, ${donor.country}
                                </p>
                                <div class="d-flex justify-content-center gap-2 mb-4">
                                    <span class="badge bg-light text-dark border"><i class="fa-regular fa-clock me-1"></i> Last: ${donor.lastDonation}</span>
                                </div>
                                <a href="contact-donor.html" class="btn btn-outline-danger rounded-pill px-4 fw-bold">Contact Donor</a>
                            </div>
                        </div>
                    </div>
                `;
                donorGrid.innerHTML += cardHTML;
            });
        }

        // ==========================================
        // 5. منطق البحث (Filtering Logic)
        // ==========================================
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault(); // منع إعادة تحميل الصفحة

            const selectedBlood = bloodGroupSelect.value;
            const selectedCountry = countrySelect.value;
            const selectedCity = citySelect.value;

            // تصفية البيانات
            const filteredDonors = donorsData.filter(donor => {
                const matchBlood = selectedBlood === "all" || donor.bloodGroup === selectedBlood;
                const matchCountry = selectedCountry === "all" || donor.country === selectedCountry;
                const matchCity = selectedCity === "all" || donor.city === selectedCity;

                return matchBlood && matchCountry && matchCity;
            });

            // عرض النتائج الجديدة
            renderDonors(filteredDonors);
        });

        // ==========================================
        // 6. التحميل المبدئي
        // ==========================================
        // عرض كل المتبرعين عند فتح الصفحة لأول مرة
        renderDonors(donorsData);
    }
});
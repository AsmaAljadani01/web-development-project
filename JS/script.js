const bookingForm = document.querySelector(".form.booking-form");
const campaignSelect = document.getElementById("campaign_type");
const contactForm = document.querySelector(".form.contact-form");

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        let messages = [];

        messages = isFilled("fullname", messages, "Full Name is missing");
        messages = isFilled("mobile", messages, "Mobile is missing");
        messages = isMobile("mobile", messages, "Mobile must contain numbers only");
        messages = isFilled("email", messages, "Email is missing");
        messages = isEmail("email", messages, "Email format is wrong");
        messages = isFilled("campaign_selection", messages, "Please select a campaign");
        messages = isFilled("guide_language", messages, "Guide language is required");
         
        const tripSelected = document.querySelector("input[name='trip_type']:checked");
        if (!tripSelected) {
            messages.push("Trip type is required");
        }

        if (messages.length > 0) {
            window.alert("Issues found [" + messages.length + "]:\n" + messages.join("\n"));
            e.preventDefault();
        } else {
        const fullName = document.querySelector("input[name='fullname']").value.trim();
        const campaign = campaignSelect.value;
        const trip_type = tripSelected.value;
        const price = getPrice(campaign);

        window.alert(
            "Thank you " + fullName + "!\n" +
            "Your booking for the " + campaign + " campaign (" + trip_type + ") is confirmed.\n" +
            "Total Price: " + price + " SAR.\n"
            );
        }
 });
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        let messages = [];

        messages = isFilled("first_name", messages, "First Name is missing");
        messages = isFilled("last_name", messages, "Last Name is missing");
        messages = isFilled("mobile", messages, "Mobile is missing");
        messages = isMobile("mobile", messages, "Mobile must contain numbers only");
        messages = isFilled("email", messages, "Email is missing");
        messages = isEmail("email", messages, "Email format is wrong");
        messages = isFilled("message", messages, "Message is missing");

        if (messages.length > 0) {
            window.alert("Issues found [" + messages.length + "]:\n" + messages.join("\n"));
            e.preventDefault();
        } else {
            const firstName = document.querySelector("input[name='first_name']").value.trim();
            const lastName = document.querySelector("input[name='last_name']").value.trim();

            window.alert(
                "Thank you " + firstName + " " + lastName + "!\n" +
                "We have received your message, We will respond as soon as possible."
            );
        }
    });
}

function isFilled(selector, messages, errorMsg) {
    const element = document.getElementsByName(selector)[0].value.trim();
    if (element.length < 1) {
        messages.push(errorMsg);
    }
    return messages;
}

function isEmail(selector, messages, errorMsg) {
    const element = document.getElementsByName(selector)[0].value.trim();
    if (!element.match("[a-z0-9]+@[a-z]+\.[a-z]{2,4}")) {
        messages.push(errorMsg);
    }
    return messages;
}

function isMobile(selector, messages, errorMsg) {
    const element = document.getElementsByName(selector)[0].value.trim();
    if (!element.match("[0-9]{10}")) {
        messages.push(errorMsg);
    }
    return messages;
}

function getPrice(campaign) {
    if (campaign === "gold") return 30000;
    if (campaign === "silver") return 15000;
    if (campaign === "economy") return 8000;
    return 0;
}


const bookingTable = document.getElementById("bookingTable");
if (bookingTable) {
    function getData() {
        const tbody = bookingTable.querySelector("tbody");

        while (tbody.firstChild) {
            tbody.removeChild(tbody.lastChild);
        }

        fetch("/viewBooking")
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                data.forEach(function(item) {
                    const row = document.createElement("tr");

                    let dateObj = new Date(item.dob);

                    var day = dateObj.getDate();
                    var month = dateObj.getMonth() + 1;
                    var year = dateObj.getFullYear();

                    const formattedDate = year + "-" + month + "-" + day;

                    row.innerHTML =
                        "<td>" + item.fullname + "</td>" +
                        "<td>" + item.mobile + "</td>" +
                        "<td>" + item.email + "</td>" +
                        "<td class='date'>" + formattedDate + "</td>" +
                        "<td>" + item.campaign_selection + "</td>" +
                        "<td>" + item.trip_type + "</td>" +
                        "<td>" + item.guide_language + "</td>" +
                        "<td>" + item.special_requests + "</td>";

                    tbody.appendChild(row);
                });
            })
            .catch(function(error) {
                console.error("Error:", error);
                alert("An error occurred!");
            });
    }

    getData();
}

var sliderArrow = document.getElementsByClassName("slider-box")[0].lastElementChild;
var sliderBox = document.getElementsByClassName("slider-box")[0];
var firstIndicator = document.getElementsByClassName("first-indicator")[0];
var secondIndicator = document.getElementsByClassName("second-indicator")[0];
var thirdIndicator = document.getElementsByClassName("third-indicator")[0];

/* I purposely avoided the for loop which would have been an easier means for rendering, so that you understand how the individual classes are called one after the other,  */
var backgroundArray = ["url(https://res.cloudinary.com/dbfue99qr/image/upload/v1694768855/phoenix/phoenix-uploads/crypto11_odwlwv.jpg)","url(https://res.cloudinary.com/dbfue99qr/image/upload/v1694768902/phoenix/phoenix-uploads/crypto8_fwkaxg.jpg)","url(https://res.cloudinary.com/dbfue99qr/image/upload/v1694768987/phoenix/phoenix-uploads/crypto12_uc69ii.jpg)"];
var holder = 0;
sliderBox.style.setProperty("transition","all 0.8s ease-in");
sliderBox.style.setProperty("background-image", "url(https://res.cloudinary.com/dbfue99qr/image/upload/v1694768987/phoenix/phoenix-uploads/crypto12_uc69ii.jpg)");
setInterval(() => {
    if (holder == 2) {
        holder = 0;
        sliderBox.style.setProperty("background-image", backgroundArray[holder]);
        firstIndicator.classList.add("indicatorActive");
        secondIndicator.classList.remove("indicatorActive");
        thirdIndicator.classList.remove("indicatorActive");
    } else {
        holder += 1;
        if (holder == 1) {
            sliderBox.style.setProperty("background-image", backgroundArray[holder]);
            firstIndicator.classList.remove("indicatorActive");
            secondIndicator.classList.add("indicatorActive");
            thirdIndicator.classList.remove("indicatorActive");
        } else {
            sliderBox.style.setProperty("background-image", backgroundArray[holder]);
            firstIndicator.classList.remove("indicatorActive");
            secondIndicator.classList.remove("indicatorActive");
            thirdIndicator.classList.add("indicatorActive");
        }
    }
}, 6000);

var menuOverlay = document.querySelector('.menu-overlay')
var logo = document.querySelector('.logo')
var menuBtn = document.querySelector('.menu-btn');
var closeBtn = document.querySelector('.close-btn');
menuBtn.addEventListener('click', function () {
    this.style.display = "none";
    logo.style.display = "none";
    menuOverlay.style.width = "100%"
})

closeBtn.addEventListener('click', function () {
    menuBtn.style.display = "initial";
    logo.style.display = "initial";
    menuOverlay.style.width = "0%"
})

var introHeader = document.getElementsByClassName('intro-header')[0]
var introBody = document.getElementsByClassName('intro-body')[0]
var introButtons = document.getElementsByClassName('intro-buttons')[0]
var bitcoinLogoImg = document.getElementsByClassName('bitcoin-logo-img')[0]
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        introHeader.style.opacity = "1";
        introHeader.style.transform = "translateY(0)";
    }, 100);
    setTimeout(() => {
        introBody.style.opacity = "1";
        introBody.style.transform = "translateX(0)";
    }, 1300);
    setTimeout(() => {
        introButtons.style.opacity = "1";
        introButtons.style.transform = "translateY(0)";
    }, 2300);
    setTimeout(() => {
        bitcoinLogoImg.style.opacity = "1";
        bitcoinLogoImg.style.transform = "translateX(0)";
    }, 3300);
})

// Function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to update the h1 innerHTML with the current number + 200
function updateStatistics() {
  const h1Elements = document.querySelectorAll("#statistics .statistics-box h1");
  if (h1Elements) {
    h1Elements.forEach((h1Element) => {
      const currentNumber = parseInt(h1Element.innerText);
      if (!isNaN(currentNumber)) {
        // Set the target number to currentNumber + 200
        const targetNumber = currentNumber + 200;

        // Calculate the step based on the difference between target and current number
        const step = Math.ceil((targetNumber - currentNumber) / 50); // 50 steps for a smoother countdown

        // Start the countdown
        let currentValue = currentNumber;
        const interval = setInterval(() => {
          currentValue += step;
          if (currentValue >= targetNumber) {
            // Ensure the final value is exact
            currentValue = targetNumber;
            clearInterval(interval);
          }
          h1Element.innerText = currentValue.toString();
        }, 50); // 50 milliseconds interval for smooth animation (adjust as needed)
      }
    });
  }
}

// Function to update the h1 innerHTML with the current number + 200
function updateStatistics() {
  const h1Elements = document.querySelectorAll("#statistics .statistics-box h1");
  if (h1Elements) {
    h1Elements.forEach((h1Element) => {
      // Extract the numeric value from the H1 element
      const currentValue = parseInt(h1Element.innerText);
      if (!isNaN(currentValue)) {
        // Set the target number to currentNumber + 200
        const targetNumber = currentValue + 200;

        // Calculate the step based on the difference between target and current number
        const step = Math.ceil((targetNumber - currentValue) / 50); // 50 steps for a smoother countdown

        // Start the countdown
        let updatedValue = currentValue;
        const interval = setInterval(() => {
          updatedValue += step;
          if (updatedValue >= targetNumber) {
            // Ensure the final value is exact
            updatedValue = targetNumber;
            clearInterval(interval);
          }
          h1Element.innerText = updatedValue.toString() + "+"; // Add the "+" sign
        }, 50); // 50 milliseconds interval for smooth animation (adjust as needed)
      }
    });
  }
}

// Function to handle the intersection changes and update statistics when in viewport
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateStatistics();
      // Unobserve the target element to avoid multiple updates
      observer.unobserve(entry.target);
    }
  });
}

// Set up the Intersection Observer
const observer = new IntersectionObserver(handleIntersection);

// Get the statistics section element
const statisticsSection = document.getElementById("statistics");

// Start observing the statistics section
if (statisticsSection) {
  observer.observe(statisticsSection);
}


var statisticsContainer = document.getElementById("statistics");
statisticsContainer.style.backgroundImage = "url(https://res.cloudinary.com/dbfue99qr/image/upload/v1694769086/phoenix/phoenix-uploads/bg2_de8cjy.jpg)";

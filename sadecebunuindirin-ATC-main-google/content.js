function ensureAlertContainer() {
    var alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '50%';
        alertContainer.style.right = '10px'; // Align container to the left
        alertContainer.style.transform = 'translateY(-50%)'; // Center vertically
        alertContainer.style.backgroundColor = '#FF0000'; // Red background
        alertContainer.style.border = '1px solid #FF0000';
        alertContainer.style.padding = '20px'; // Increased padding
        alertContainer.style.borderRadius = '10px'; // Rounded corners
        alertContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Light shadow
        alertContainer.style.zIndex = '1000';
        alertContainer.style.display = 'flex';
        alertContainer.style.flexDirection = 'column';
        alertContainer.style.alignItems = 'flex-start'; // Align items to the left

        // Create and append logo
        var logo = document.createElement('img');
        logo.src = 'https://www.interpublic.com/wp-content/uploads/2019/04/Logo_UM-e1566481266432.png';
        logo.alt = 'Logo';
        logo.id = 'alert-logo';
        logo.style.width = '50px'; // Adjust width as needed
        logo.style.height = '50px'; // Adjust height as needed
        logo.style.marginBottom = '10px'; // Space between logo and alerts
        alertContainer.appendChild(logo);

        document.body.appendChild(alertContainer);
    }
    return alertContainer;
}

function removeAlertContainerIfEmpty() {
    var alertContainer = document.getElementById('alert-container');
    if (alertContainer && alertContainer.childElementCount <= 1) { // Adjust to 1 because of the logo
        alertContainer.remove();
    }
}

function addAlert(id, message) {
    var alertContainer = ensureAlertContainer();
    var alert = document.getElementById(id);
    if (!alert) {
        alert = document.createElement('p');
        alert.id = id;
        alert.textContent = message;
        alert.style.margin = '0 0 10px 0'; // Space between alerts
        alert.style.padding = '10px'; // Padding for alerts
        alert.style.backgroundColor = '#f8f9fa'; // Light background for alerts
        alert.style.border = '1px solid #ff0000'; // Red border for alerts
        alert.style.borderRadius = '5px'; // Rounded corners for alerts
        alertContainer.appendChild(alert);
    }
}

function removeAlert(id) {
    var alert = document.getElementById(id);
    if (alert) {
        alert.remove();
        removeAlertContainerIfEmpty();
    }
}

var targetNode = document.body;
var config = { attributes: true, childList: true, subtree: true };


///////////////// FACEBOOK ////////////////

var callback = function(mutationsList, observer) {
    for (var mutation of mutationsList) {
        var element = document.querySelector('[aria-label="Create A/B test"]');
        if (element && element.getAttribute('aria-checked') === 'true') {
            addAlert('alert1', 'A/B test oluşturma durumu tespit edildi.');
        } else {
            removeAlert('alert1');
        }

        var spans = document.querySelectorAll('span');
        var foundDailyBudget = false;
        spans.forEach(function(span) {
            if (span.textContent.includes('Daily budget')) {
                foundDailyBudget = true;
                addAlert('alert4', 'Daily budget seçildi.');
            }
        });
        if (!foundDailyBudget) {
            removeAlert('alert4');
        }

        var inputs = document.querySelectorAll('input[placeholder="Please enter amount"]');
        var budgetExceeded = false;
        inputs.forEach(function(input) {
            var value = parseFloat(input.value.replace('$', ''));
            if (!isNaN(value) && value > 50) {
                budgetExceeded = true;
                addAlert('alert5', 'Bütçe aşıldı.');
            }
        });
        if (!budgetExceeded) {
            removeAlert('alert5');
        }

        var dollarInputs = document.querySelectorAll('input[value^="$"]');
        var exceededValue = false;
        dollarInputs.forEach(function(input) {
            var value = parseFloat(input.value.replace('$', ''));
            if (!isNaN(value) && value > 100) {
                exceededValue = true;
                addAlert('alert6', 'Ad setteki bütçe 100 doların üzerinde.');
            }
        });
        if (!exceededValue) {
            removeAlert('alert6');
        }

        // Campaign name ve Ad set name inputlarını dinlemek için
        let inputElement1 = document.querySelector('input[placeholder="Enter your campaign name here..."]');
        if (inputElement1) {
            inputElement1.addEventListener('input', function() {
                if (inputElement1.value.toLowerCase() === 'dyson') {
                    addAlert('alert2', 'Campaign name "Dyson" olarak girildi.');
                } else {
                    removeAlert('alert2');
                }
            });
        }

        let inputElement2 = document.querySelector('input[placeholder="Enter your ad set name here..."]');
        if (inputElement2) {
            inputElement2.addEventListener('input', function() {
                if (inputElement2.value.toLowerCase() === 'dyson') {
                    addAlert('alert3', 'Ad set name "Dyson" olarak girildi.');
                } else {
                    removeAlert('alert3');
                }
            });
        }

        checkDivContent(); // Call to check for specific div content
    }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);


// Function to handle input change for budget (₺ cinsinden)
function handleBudgetInputChange(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 100) {
        addAlert('alert7', 'Bütçe tutarı 100₺ üzerinde.');
    } else {
        removeAlert('alert7');
    }
}


//////////////////// GOOOGLE //////////////////

const budgetInput = document.querySelector('input[aria-label="Bütçe tutarı (₺ cinsinden)"]');
if (budgetInput) {
    budgetInput.addEventListener('input', handleBudgetInputChange);
} else {
    console.log('Input element with aria-label="Bütçe tutarı (₺ cinsinden)" not found.');
}

// Function to handle input change for campaign name
function handleCampaignInputChange(event) {
    const value = event.target.value.toLowerCase();
    if (value === 'dyson') {
        addAlert('alert8', 'Kampanya adı "Dyson" olarak girildi.');
    } else {
        removeAlert('alert8');
    }
}

const campaignInput = document.querySelector('input[aria-label="Kampanya adı"]');
if (campaignInput) {
    campaignInput.addEventListener('input', handleCampaignInputChange);
} else {
    console.log('Input element with aria-label="Kampanya adı" not found.');
}

// Function to handle input change for target CPM bid (₺ cinsinden)
function handleTargetCPMBidInputChange(event) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 100) {
        addAlert('alert9', 'Hedef GBM teklifi 100₺ üzerinde.');
    } else {
        removeAlert('alert9');
    }
}

const targetCPMBidInput = document.querySelector('input[aria-label="Hedef GBM teklifi (₺ cinsinden)"]');
if (targetCPMBidInput) {
    targetCPMBidInput.addEventListener('input', handleTargetCPMBidInputChange);
} else {
    console.log('Input element with aria-label="Hedef GBM teklifi (₺ cinsinden)" not found.');
}

// Function to handle textarea change for keywords
function handleKeywordTextareaChange(event) {
    const value = event.target.value.toLowerCase();
    if (value.includes('entertainment')) {
        addAlert('alert10', 'Anahtar kelimeler arasında "entertainment" bulundu.');
    } else {
        removeAlert('alert10');
    }
}

const keywordTextarea1 = document.querySelector('textarea[aria-label="Anahtar kelimeleri girin veya yapıştırın. Anahtar kelimeleri birbirinden virgülle ayırabilir veya her satıra bir anahtar kelime girebilirsiniz."]');
if (keywordTextarea1) {
    keywordTextarea1.addEventListener('input', handleKeywordTextareaChange);
} else {
    console.log('Textarea element with specified aria-label not found.');
}

const keywordTextarea2 = document.querySelector('textarea[aria-label="Kelimeye veya kelime öbeğine göre arama yapın"]');
if (keywordTextarea2) {
    keywordTextarea2.addEventListener('input', handleKeywordTextareaChange);
} else {
    console.log('Textarea element with specified aria-label not found.');
}

// Function to check the content of the div with debugid="title" and show an alert if it matches
function checkDivContent() {
    const targetDiv = document.querySelector('div[debugid="title"]');
    if (targetDiv && targetDiv.textContent.includes('Sanat ve Eğlence')) {
        addAlert('alert11', 'Sanat ve Eğlence içeriği bulundu.');
    } else {
        removeAlert('alert11');
    }
}

// Run the function immediately to check the div content
checkDivContent();

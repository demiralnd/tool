function ensureAlertContainer() {
    var alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '50%';
        alertContainer.style.right = '10px';
        alertContainer.style.transform = 'translateY(-50%)'; // Ekranın yüksekliğinde ortalamak için translateY kullanıyoruz
        alertContainer.style.backgroundColor = '#FF0000'; // Arka plan rengini biraz şeffaf yapıyoruz
        alertContainer.style.border = '1px solid #FF0000';
        alertContainer.style.padding = '20px'; // Padding değerini arttırdık
        alertContainer.style.borderRadius = '10px'; // Daha yuvarlak köşeler için border-radius ekliyoruz
        alertContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Hafif bir gölge ekliyoruz
        alertContainer.style.zIndex = '1000';
        document.body.appendChild(alertContainer);
    }
    return alertContainer;
}

function removeAlertContainerIfEmpty() {
    var alertContainer = document.getElementById('alert-container');
    if (alertContainer && alertContainer.childElementCount === 0) {
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
        alert.style.margin = '0 0 10px 0'; // Alerts arasında biraz boşluk bırakıyoruz
        alert.style.padding = '10px'; // Alerts için padding ekliyoruz
        alert.style.backgroundColor = '#f8f9fa'; // Alerts arka plan rengini ayarlıyoruz
        alert.style.border = '1px solid #ff0000'; // Alerts için sınır rengi ekliyoruz
        alert.style.borderRadius = '5px'; // Alerts köşelerini yuvarlıyoruz
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
    }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

let previousPrice = 0;
let chart;
let chartData = {
    labels: [],
    datasets: [{
        label: 'Price',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
    }]
};

async function fetchPrice() {
    const symbol = document.getElementById('search').value.toUpperCase();
    if (!symbol) return;

    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Coin not found');
        const data = await response.json();
        const currentPrice = parseFloat(data.price);
        const priceElement = document.getElementById('price');
        const priceIcon = document.getElementById('price-icon');
        const updateTime = document.getElementById('update-time');

        let changeIcon = '';
        if (currentPrice > previousPrice) {
            changeIcon = '<i class="fas fa-arrow-up"></i>';
            priceElement.style.color = '#28a745';
            priceIcon.style.color = '#28a745';
        } else if (currentPrice < previousPrice) {
            changeIcon = '<i class="fas fa-arrow-down"></i>';
            priceElement.style.color = '#dc3545';
            priceIcon.style.color = '#dc3545';
        } else {
            changeIcon = '<i class="fas fa-arrows-alt-h"></i>';
            priceElement.style.color = '#6c757d';
            priceIcon.style.color = '#6c757d';
        }

        priceElement.innerHTML = `Price: $${currentPrice.toFixed(2)}`;
        priceIcon.innerHTML = changeIcon;
        previousPrice = currentPrice;
        updateTime.textContent = `Last Updated: ${new Date().toLocaleTimeString()}`;
        errorMessage.textContent = '';

        if (chart) chart.destroy();
        const ctx = document.getElementById('chart').getContext('2d');

        chartData.labels.push(new Date().toLocaleTimeString());
        chartData.datasets[0].data.push(currentPrice);

        if (chartData.labels.length > 10) {
            chartData.labels.shift();
            chartData.datasets[0].data.shift();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Price: $${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [5, 5],
                            drawBorder: false,
                        },
                        ticks: {
                            beginAtZero: false,
                        }
                    }
                }
            }
        });

    } catch (error) {
        document.getElementById('price').textContent = 'Error';
        document.getElementById('price-icon').innerHTML = '';
        document.getElementById('update-time').textContent = '';
        errorMessage.textContent = 'Coin symbol not found. Please try again.';
    }
}

document.getElementById('search').value = 'BTCUSDT';
fetchPrice();
setInterval(fetchPrice, 15000);

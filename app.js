// SIP Calculator JavaScript Application

// Global variables
let timelineChart = null;
let breakdownChart = null;

// Fund database
const fundDatabase = [
    {
        name: "HDFC Top 100 Fund",
        category: "Large Cap",
        nav: 745.32,
        returns: { "1yr": 18.5, "3yr": 14.2, "5yr": 12.8 },
        expenseRatio: 1.05,
        aum: 25840,
        riskLevel: "Moderate",
        fundManager: "Chirag Setalvad",
        minInvestment: 5000,
        suitableFor: ["Long-term wealth creation", "Retirement planning"]
    },
    {
        name: "Axis Midcap Fund",
        category: "Mid Cap",
        nav: 68.45,
        returns: { "1yr": 24.8, "3yr": 18.7, "5yr": 16.2 },
        expenseRatio: 1.35,
        aum: 12540,
        riskLevel: "High",
        fundManager: "Shreyash Devalkar",
        minInvestment: 5000,
        suitableFor: ["Aggressive growth", "Long accumulation periods"]
    },
    {
        name: "ICICI Pru Bluechip Fund",
        category: "Large Cap",
        nav: 45.67,
        returns: { "1yr": 16.8, "3yr": 13.5, "5yr": 11.9 },
        expenseRatio: 1.12,
        aum: 32150,
        riskLevel: "Moderate",
        fundManager: "Anish Tawakley",
        minInvestment: 5000,
        suitableFor: ["Stable growth", "Conservative investors"]
    },
    {
        name: "SBI Small Cap Fund",
        category: "Small Cap",
        nav: 134.89,
        returns: { "1yr": 32.4, "3yr": 22.1, "5yr": 18.7 },
        expenseRatio: 1.68,
        aum: 8750,
        riskLevel: "High",
        fundManager: "R. Srinivasan",
        minInvestment: 5000,
        suitableFor: ["High growth potential", "Long-term investors"]
    },
    {
        name: "HDFC Short Term Debt Fund",
        category: "Debt",
        nav: 25.43,
        returns: { "1yr": 7.2, "3yr": 6.8, "5yr": 7.1 },
        expenseRatio: 0.45,
        aum: 15620,
        riskLevel: "Low",
        fundManager: "Krishan Kumar Daga",
        minInvestment: 5000,
        suitableFor: ["Capital preservation", "Short-term goals"]
    },
    {
        name: "Axis Long Term Equity Fund",
        category: "ELSS",
        nav: 56.78,
        returns: { "1yr": 19.3, "3yr": 15.7, "5yr": 13.4 },
        expenseRatio: 1.28,
        aum: 9840,
        riskLevel: "Moderate",
        fundManager: "Jinesh Gopani",
        minInvestment: 500,
        suitableFor: ["Tax saving", "Long-term wealth creation"]
    },
    {
        name: "Kotak Emerging Equity Fund",
        category: "Mid Cap",
        nav: 67.23,
        returns: { "1yr": 26.7, "3yr": 19.4, "5yr": 17.1 },
        expenseRatio: 1.48,
        aum: 11250,
        riskLevel: "High",
        fundManager: "Pankaj Tibrewal",
        minInvestment: 5000,
        suitableFor: ["Mid-cap exposure", "Growth seekers"]
    },
    {
        name: "HDFC Balanced Advantage Fund",
        category: "Hybrid",
        nav: 23.45,
        returns: { "1yr": 14.6, "3yr": 11.8, "5yr": 10.2 },
        expenseRatio: 1.15,
        aum: 18730,
        riskLevel: "Moderate",
        fundManager: "Prashant Jain",
        minInvestment: 5000,
        suitableFor: ["Balanced allocation", "Moderate risk"]
    },
    {
        name: "Motilal Oswal Nasdaq 100 Fund",
        category: "International",
        nav: 34.56,
        returns: { "1yr": 28.9, "3yr": 20.3, "5yr": 16.8 },
        expenseRatio: 0.85,
        aum: 5670,
        riskLevel: "High",
        fundManager: "Rakesh Singh",
        minInvestment: 5000,
        suitableFor: ["International exposure", "Tech growth"]
    },
    {
        name: "SBI Bluechip Fund",
        category: "Large Cap",
        nav: 78.90,
        returns: { "1yr": 17.2, "3yr": 13.8, "5yr": 12.1 },
        expenseRatio: 0.98,
        aum: 22460,
        riskLevel: "Moderate",
        fundManager: "Sohini Andani",
        minInvestment: 5000,
        suitableFor: ["Large cap exposure", "Steady growth"]
    }
];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize all components
    initializeTabs();
    initializeLumpsumToggle();
    initializeEventListeners();
    populateFundsList();
    
    // Auto-calculate on page load
    calculateSIP();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSIP);
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInvestmentPlan);
    }

    // Goal planning button
    const calculateGoalBtn = document.getElementById('calculateGoalBtn');
    if (calculateGoalBtn) {
        calculateGoalBtn.addEventListener('click', calculateGoal);
    }

    // Portfolio builder button
    const generatePortfolioBtn = document.getElementById('generatePortfolioBtn');
    if (generatePortfolioBtn) {
        generatePortfolioBtn.addEventListener('click', generatePortfolio);
    }

    // Add event listeners for real-time calculation on input changes
    const formInputs = [
        'sipAmount', 'sipIncrease', 'sipDuration', 'accumulationYears',
        'expectedReturn', 'inflationRate', 'onetimeAmount', 
        'recurringAmount', 'recurringDuration', 'recurringIncrease'
    ];
    
    formInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', debounce(calculateSIP, 300));
            element.addEventListener('change', calculateSIP);
        }
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab contents:', tabContents.length);

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = this.getAttribute('data-tab');
            console.log('Switching to tab:', targetTab);
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Successfully switched to tab:', targetTab);
                
                // Initialize specific tab content
                if (targetTab === 'fund-discovery') {
                    setTimeout(() => populateFundsList(), 100);
                }
            } else {
                console.error('Tab content not found:', targetTab);
            }
        });
    });
}

// Lumpsum type toggle
function initializeLumpsumToggle() {
    const lumpsumType = document.getElementById('lumpsumType');
    const onetimeSection = document.getElementById('onetimeLumpsum');
    const recurringSection = document.getElementById('recurringLumpsum');

    if (!lumpsumType || !onetimeSection || !recurringSection) {
        console.error('Lumpsum elements not found');
        return;
    }

    console.log('Initializing lumpsum toggle...');

    // Set initial state
    onetimeSection.classList.add('hidden');
    recurringSection.classList.add('hidden');

    lumpsumType.addEventListener('change', function(e) {
        const selectedType = this.value;
        console.log('Lumpsum type changed to:', selectedType);
        
        // Hide all sections first
        onetimeSection.classList.add('hidden');
        recurringSection.classList.add('hidden');
        
        // Show relevant section
        if (selectedType === 'onetime') {
            onetimeSection.classList.remove('hidden');
            console.log('Showing onetime section');
        } else if (selectedType === 'recurring') {
            recurringSection.classList.remove('hidden');
            console.log('Showing recurring section');
        }
        
        // Recalculate
        calculateSIP();
    });
}

// Main SIP calculation function
function calculateSIP() {
    try {
        console.log('Starting SIP calculation...');
        
        // Get form values
        const sipAmount = parseFloat(document.getElementById('sipAmount').value) || 0;
        const sipIncrease = parseFloat(document.getElementById('sipIncrease').value) || 0;
        const sipDuration = parseInt(document.getElementById('sipDuration').value) || 0;
        const accumulationYears = parseInt(document.getElementById('accumulationYears').value) || 0;
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
        
        console.log('Input values:', { sipAmount, sipIncrease, sipDuration, accumulationYears, expectedReturn, inflationRate });
        
        // Validation
        if (sipAmount <= 0 || sipDuration <= 0 || expectedReturn <= 0) {
            console.log('Invalid inputs, skipping calculation');
            return;
        }
        
        // Lumpsum calculations
        const lumpsumType = document.getElementById('lumpsumType').value;
        let lumpsumFV = 0;
        let totalLumpsumInvestment = 0;
        
        console.log('Lumpsum type:', lumpsumType);
        
        if (lumpsumType === 'onetime') {
            const onetimeAmount = parseFloat(document.getElementById('onetimeAmount').value) || 0;
            const totalYears = sipDuration + accumulationYears;
            lumpsumFV = onetimeAmount * Math.pow(1 + expectedReturn / 100, totalYears);
            totalLumpsumInvestment = onetimeAmount;
        } else if (lumpsumType === 'recurring') {
            const recurringAmount = parseFloat(document.getElementById('recurringAmount').value) || 0;
            const recurringDuration = parseInt(document.getElementById('recurringDuration').value) || 0;
            const recurringIncrease = parseFloat(document.getElementById('recurringIncrease').value) || 0;
            
            const recurringResult = calculateRecurringLumpsum(
                recurringAmount, 
                recurringDuration, 
                recurringIncrease, 
                expectedReturn, 
                sipDuration + accumulationYears
            );
            
            lumpsumFV = recurringResult.futureValue;
            totalLumpsumInvestment = recurringResult.totalInvestment;
        }

        // Calculate SIP with step-up and accumulation
        const result = calculateSIPWithAccumulation(
            sipAmount, 
            sipIncrease / 100, 
            sipDuration, 
            accumulationYears, 
            expectedReturn / 100
        );

        console.log('SIP calculation result:', result);

        // Calculate real value
        const totalYears = sipDuration + accumulationYears;
        const realValue = (result.totalFV + lumpsumFV) / Math.pow(1 + inflationRate / 100, totalYears);

        // Update results display
        updateResultsDisplay(result, lumpsumFV, realValue, sipDuration, accumulationYears, totalLumpsumInvestment);
        
        // Generate charts
        generateCharts(result, sipDuration, accumulationYears, sipAmount, sipIncrease / 100, expectedReturn / 100);
        
        // Generate year-wise projection
        generateYearWiseProjection(sipAmount, sipIncrease / 100, sipDuration, accumulationYears, expectedReturn / 100);
        
        // Show results
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.classList.add('fade-in');
        }

        console.log('SIP calculation completed successfully');

    } catch (error) {
        console.error('Calculation error:', error);
    }
}

// Calculate SIP with accumulation years
function calculateSIPWithAccumulation(monthlyAmount, stepUpRate, sipYears, accumulationYears, annualReturn) {
    const monthlyReturn = annualReturn / 12;
    let totalInvestment = 0;
    let currentSIP = monthlyAmount;
    let corpus = 0;
    
    // Phase 1: SIP Investment Phase
    for (let year = 1; year <= sipYears; year++) {
        // Calculate monthly investments for this year
        for (let month = 1; month <= 12; month++) {
            totalInvestment += currentSIP;
            corpus = (corpus + currentSIP) * (1 + monthlyReturn);
        }
        
        // Increase SIP for next year
        if (year < sipYears) {
            currentSIP = currentSIP * (1 + stepUpRate);
        }
    }
    
    const sipEndValue = corpus;
    
    // Phase 2: Accumulation Phase
    const totalFV = corpus * Math.pow(1 + annualReturn, accumulationYears);
    const accumulationGrowth = totalFV - sipEndValue;
    
    return {
        totalInvestment,
        sipEndValue,
        totalFV,
        accumulationGrowth
    };
}

// Calculate recurring lumpsum
function calculateRecurringLumpsum(annualAmount, duration, increaseRate, expectedReturn, remainingYears) {
    let totalInvestment = 0;
    let futureValue = 0;
    let currentAmount = annualAmount;
    
    for (let year = 1; year <= duration; year++) {
        totalInvestment += currentAmount;
        const yearsToGrow = remainingYears - year + 1;
        futureValue += currentAmount * Math.pow(1 + expectedReturn / 100, yearsToGrow);
        currentAmount = currentAmount * (1 + increaseRate / 100);
    }
    
    return { totalInvestment, futureValue };
}

// Update results display
function updateResultsDisplay(result, lumpsumFV, realValue, sipDuration, accumulationYears, totalLumpsumInvestment) {
    const totalCorpus = result.totalFV + lumpsumFV;
    const totalInvestment = result.totalInvestment + totalLumpsumInvestment;
    
    // Summary cards
    const finalCorpusEl = document.getElementById('finalCorpus');
    const realValueEl = document.getElementById('realValue');
    const totalTimelineEl = document.getElementById('totalTimeline');
    
    if (finalCorpusEl) finalCorpusEl.textContent = formatCurrency(totalCorpus);
    if (realValueEl) realValueEl.textContent = formatCurrency(realValue);
    if (totalTimelineEl) totalTimelineEl.textContent = `Total Timeline: ${sipDuration + accumulationYears} years`;
    
    // Phase breakdown
    const sipPhaseDurationEl = document.getElementById('sipPhaseDuration');
    const accumulationPhaseDurationEl = document.getElementById('accumulationPhaseDuration');
    const totalInvestmentEl = document.getElementById('totalInvestment');
    const sipEndValueEl = document.getElementById('sipEndValue');
    const accumulationGrowthEl = document.getElementById('accumulationGrowth');
    const accumulationEndValueEl = document.getElementById('accumulationEndValue');
    
    if (sipPhaseDurationEl) sipPhaseDurationEl.textContent = `Duration: ${sipDuration} years`;
    if (accumulationPhaseDurationEl) accumulationPhaseDurationEl.textContent = `Duration: ${accumulationYears} years`;
    if (totalInvestmentEl) totalInvestmentEl.textContent = formatCurrency(totalInvestment);
    if (sipEndValueEl) sipEndValueEl.textContent = formatCurrency(result.sipEndValue);
    if (accumulationGrowthEl) accumulationGrowthEl.textContent = formatCurrency(result.accumulationGrowth);
    if (accumulationEndValueEl) accumulationEndValueEl.textContent = formatCurrency(totalCorpus);
}

// Generate charts
function generateCharts(result, sipDuration, accumulationYears, monthlyAmount, stepUpRate, annualReturn) {
    generateTimelineChart(sipDuration, accumulationYears, monthlyAmount, stepUpRate, annualReturn);
    generateBreakdownChart(result);
}

// Generate timeline chart
function generateTimelineChart(sipDuration, accumulationYears, monthlyAmount, stepUpRate, annualReturn) {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (timelineChart) {
        timelineChart.destroy();
    }
    
    const years = [];
    const sipPhaseData = [];
    const accumulationPhaseData = [];
    
    let corpus = 0;
    let currentSIP = monthlyAmount;
    const monthlyReturn = annualReturn / 12;
    
    // SIP Phase
    for (let year = 1; year <= sipDuration; year++) {
        years.push(year);
        
        for (let month = 1; month <= 12; month++) {
            corpus = (corpus + currentSIP) * (1 + monthlyReturn);
        }
        
        sipPhaseData.push(corpus);
        accumulationPhaseData.push(null);
        
        if (year < sipDuration) {
            currentSIP = currentSIP * (1 + stepUpRate);
        }
    }
    
    // Accumulation Phase
    for (let year = 1; year <= accumulationYears; year++) {
        years.push(sipDuration + year);
        corpus = corpus * (1 + annualReturn);
        sipPhaseData.push(null);
        accumulationPhaseData.push(corpus);
    }
    
    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'SIP Phase',
                    data: sipPhaseData,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Accumulation Phase',
                    data: accumulationPhaseData,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(1) + 'L';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Generate breakdown chart
function generateBreakdownChart(result) {
    const canvas = document.getElementById('breakdownChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (breakdownChart) {
        breakdownChart.destroy();
    }
    
    const totalReturns = result.sipEndValue - result.totalInvestment;
    
    breakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Investment', 'SIP Returns', 'Accumulation Growth'],
            datasets: [{
                data: [result.totalInvestment, totalReturns, result.accumulationGrowth],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ₹' + context.parsed.toLocaleString('en-IN') + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Generate year-wise projection table
function generateYearWiseProjection(monthlyAmount, stepUpRate, sipDuration, accumulationYears, annualReturn) {
    const tableBody = document.getElementById('projectionTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let corpus = 0;
    let currentSIP = monthlyAmount;
    let totalInvestment = 0;
    const monthlyReturn = annualReturn / 12;
    
    // SIP Phase
    for (let year = 1; year <= sipDuration; year++) {
        const yearlyInvestment = currentSIP * 12;
        totalInvestment += yearlyInvestment;
        
        for (let month = 1; month <= 12; month++) {
            corpus = (corpus + currentSIP) * (1 + monthlyReturn);
        }
        
        const growth = corpus - totalInvestment;
        
        const row = `
            <tr class="phase-sip">
                <td>${year}</td>
                <td><span class="phase-badge badge-sip">SIP</span></td>
                <td>${formatCurrency(yearlyInvestment)}</td>
                <td>${formatCurrency(totalInvestment)}</td>
                <td>${formatCurrency(corpus)}</td>
                <td>${formatCurrency(growth)}</td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
        
        if (year < sipDuration) {
            currentSIP = currentSIP * (1 + stepUpRate);
        }
    }
    
    // Accumulation Phase
    for (let year = 1; year <= accumulationYears; year++) {
        const previousCorpus = corpus;
        corpus = corpus * (1 + annualReturn);
        const totalGrowth = corpus - totalInvestment;
        
        const row = `
            <tr class="phase-accumulation">
                <td>${sipDuration + year}</td>
                <td><span class="phase-badge badge-accumulation">Accumulation</span></td>
                <td>₹0</td>
                <td>${formatCurrency(totalInvestment)}</td>
                <td>${formatCurrency(corpus)}</td>
                <td>${formatCurrency(totalGrowth)}</td>
            </tr>
        `;
        
        tableBody.innerHTML += row;
    }
}

// Goal planning calculation
function calculateGoal() {
    console.log('Calculating goal...');
    
    const goalAmount = parseFloat(document.getElementById('goalAmount').value) || 0;
    const goalTimeline = parseInt(document.getElementById('goalTimeline').value) || 0;
    const riskTolerance = document.getElementById('riskTolerance').value;
    
    if (goalAmount <= 0 || goalTimeline <= 0) {
        alert('Please enter valid goal amount and timeline.');
        return;
    }
    
    let expectedReturn = 0;
    let strategy = '';
    
    switch (riskTolerance) {
        case 'conservative':
            expectedReturn = 7;
            strategy = 'Focus on debt funds and balanced funds for steady growth with lower risk.';
            break;
        case 'moderate':
            expectedReturn = 10.5;
            strategy = 'Mix of large-cap equity and debt funds for balanced risk-return profile.';
            break;
        case 'aggressive':
            expectedReturn = 15.5;
            strategy = 'Emphasis on mid-cap and small-cap funds for higher growth potential.';
            break;
    }
    
    const monthlyRate = expectedReturn / 12 / 100;
    const months = goalTimeline * 12;
    const requiredSIP = goalAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    
    const requiredSIPEl = document.getElementById('requiredSIP');
    const goalStrategyEl = document.getElementById('goalStrategy');
    const goalResultsEl = document.getElementById('goalResults');
    
    if (requiredSIPEl) requiredSIPEl.textContent = formatCurrency(requiredSIP);
    if (goalStrategyEl) goalStrategyEl.textContent = strategy;
    if (goalResultsEl) goalResultsEl.classList.remove('hidden');
    
    console.log('Goal calculation completed');
}

// Fund discovery functions
function populateFundsList() {
    const fundsList = document.getElementById('fundsList');
    if (!fundsList) return;
    
    console.log('Populating funds list...');
    displayFunds(fundDatabase);
    
    // Add event listeners for filters
    const categoryFilter = document.getElementById('fundCategory');
    const riskFilter = document.getElementById('riskFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterFunds);
    }
    if (riskFilter) {
        riskFilter.addEventListener('change', filterFunds);
    }
}

function filterFunds() {
    console.log('Filtering funds...');
    
    const categoryFilter = document.getElementById('fundCategory').value;
    const riskFilter = document.getElementById('riskFilter').value;
    
    let filteredFunds = fundDatabase;
    
    if (categoryFilter !== 'all') {
        filteredFunds = filteredFunds.filter(fund => fund.category === categoryFilter);
    }
    
    if (riskFilter !== 'all') {
        filteredFunds = filteredFunds.filter(fund => fund.riskLevel === riskFilter);
    }
    
    displayFunds(filteredFunds);
}

function displayFunds(funds) {
    const fundsList = document.getElementById('fundsList');
    if (!fundsList) return;
    
    if (funds.length === 0) {
        fundsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No funds match your criteria.</p>';
        return;
    }
    
    fundsList.innerHTML = funds.map(fund => `
        <div class="fund-card">
            <div class="fund-header">
                <div>
                    <div class="fund-name">${fund.name}</div>
                    <div class="fund-category">${fund.category}</div>
                </div>
                <div class="fund-nav">
                    <span class="nav-label">NAV</span>
                    <span class="nav-value">₹${fund.nav}</span>
                </div>
            </div>
            
            <div class="fund-metrics">
                <div class="fund-metric">
                    <span class="metric-label">1 Year</span>
                    <span class="metric-value">${fund.returns['1yr']}%</span>
                </div>
                <div class="fund-metric">
                    <span class="metric-label">3 Year</span>
                    <span class="metric-value">${fund.returns['3yr']}%</span>
                </div>
                <div class="fund-metric">
                    <span class="metric-label">5 Year</span>
                    <span class="metric-value">${fund.returns['5yr']}%</span>
                </div>
            </div>
            
            <div class="fund-details">
                <div class="fund-detail">
                    <span class="label">Expense Ratio:</span>
                    <span class="value">${fund.expenseRatio}%</span>
                </div>
                <div class="fund-detail">
                    <span class="label">AUM:</span>
                    <span class="value">₹${fund.aum} Cr</span>
                </div>
                <div class="fund-detail">
                    <span class="label">Risk Level:</span>
                    <span class="value">${fund.riskLevel}</span>
                </div>
                <div class="fund-detail">
                    <span class="label">Fund Manager:</span>
                    <span class="value">${fund.fundManager}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('Displayed', funds.length, 'funds');
}

// Portfolio builder
function generatePortfolio() {
    console.log('Generating portfolio...');
    
    const portfolioAmount = parseFloat(document.getElementById('portfolioAmount').value) || 0;
    const portfolioRisk = document.getElementById('portfolioRisk').value;
    
    if (portfolioAmount <= 0) {
        alert('Please enter a valid portfolio amount.');
        return;
    }
    
    let allocation = [];
    
    switch (portfolioRisk) {
        case 'conservative':
            allocation = [
                { fund: fundDatabase.find(f => f.name === "HDFC Short Term Debt Fund"), percentage: 40 },
                { fund: fundDatabase.find(f => f.name === "HDFC Top 100 Fund"), percentage: 35 },
                { fund: fundDatabase.find(f => f.name === "HDFC Balanced Advantage Fund"), percentage: 25 }
            ];
            break;
        case 'moderate':
            allocation = [
                { fund: fundDatabase.find(f => f.name === "HDFC Top 100 Fund"), percentage: 40 },
                { fund: fundDatabase.find(f => f.name === "Axis Midcap Fund"), percentage: 25 },
                { fund: fundDatabase.find(f => f.name === "HDFC Short Term Debt Fund"), percentage: 20 },
                { fund: fundDatabase.find(f => f.name === "Axis Long Term Equity Fund"), percentage: 15 }
            ];
            break;
        case 'aggressive':
            allocation = [
                { fund: fundDatabase.find(f => f.name === "Axis Midcap Fund"), percentage: 30 },
                { fund: fundDatabase.find(f => f.name === "SBI Small Cap Fund"), percentage: 25 },
                { fund: fundDatabase.find(f => f.name === "HDFC Top 100 Fund"), percentage: 25 },
                { fund: fundDatabase.find(f => f.name === "Motilal Oswal Nasdaq 100 Fund"), percentage: 20 }
            ];
            break;
    }
    
    const portfolioHtml = `
        <div class="portfolio-header">
            <h4>Recommended Portfolio - ${portfolioRisk.charAt(0).toUpperCase() + portfolioRisk.slice(1)} Risk</h4>
            <p>Total Investment: ${formatCurrency(portfolioAmount)}</p>
        </div>
        <div class="portfolio-allocation">
            ${allocation.map(item => `
                <div class="allocation-item">
                    <div class="allocation-fund">
                        <div class="fund-name">${item.fund.name}</div>
                        <div class="fund-category">${item.fund.category} • ${item.fund.riskLevel} Risk</div>
                    </div>
                    <div class="allocation-percentage">${item.percentage}%</div>
                    <div class="allocation-amount">${formatCurrency(portfolioAmount * item.percentage / 100)}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    const portfolioRecommendationEl = document.getElementById('portfolioRecommendation');
    if (portfolioRecommendationEl) {
        portfolioRecommendationEl.innerHTML = portfolioHtml;
        portfolioRecommendationEl.classList.remove('hidden');
    }
    
    console.log('Portfolio generation completed');
}

// Export functionality
function exportInvestmentPlan() {
    console.log('Exporting investment plan...');
    
    // Get current calculation results
    const sipAmount = parseFloat(document.getElementById('sipAmount').value) || 0;
    const sipDuration = parseInt(document.getElementById('sipDuration').value) || 0;
    const accumulationYears = parseInt(document.getElementById('accumulationYears').value) || 0;
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
    
    const finalCorpusEl = document.getElementById('finalCorpus');
    const realValueEl = document.getElementById('realValue');
    
    const finalCorpus = finalCorpusEl ? finalCorpusEl.textContent : 'N/A';
    const realValue = realValueEl ? realValueEl.textContent : 'N/A';
    
    // Create export content
    const content = `
SIP INVESTMENT PLAN SUMMARY
==========================

Investment Details:
- Monthly SIP Amount: ₹${sipAmount.toLocaleString('en-IN')}
- SIP Duration: ${sipDuration} years
- Accumulation Period: ${accumulationYears} years  
- Expected Annual Return: ${expectedReturn}%
- Total Timeline: ${sipDuration + accumulationYears} years

Projected Results:
- Final Corpus: ${finalCorpus}
- Real Value: ${realValue}

Generated on: ${new Date().toLocaleDateString('en-IN')}

Disclaimer: This is a projection based on assumptions and actual results may vary.
`;
    
    // Create and download file
    try {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sip-investment-plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Export completed successfully');
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
    }
}

// Utility functions
function formatCurrency(amount) {
    if (isNaN(amount) || amount === 0) return '₹0';
    
    if (amount >= 10000000) { // 1 crore
        return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) { // 1 lakh
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    } else if (amount >= 1000) { // 1 thousand
        return '₹' + (amount / 1000).toFixed(2) + ' K';
    } else {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
class Dashboard {
    constructor() {
        this.data = [];
        this.filters = {};
        this.charts = {
            intensityChart: null,
            likelihoodChart: null
        };
        
        this.initializeFilters();
        this.initializeResetButton();
        this.loadData();
    }

    initializeFilters() {
        const filterIds = [
            'endYear',
            'topic',
            'sector',
            'region',
            'pestle',
            'source',
            'country',
            'city'
        ];
        
        filterIds.forEach(id => {
            const element = document.getElementById(id + 'Filter');
            if (element) {
                element.addEventListener('change', () => {
                    if (element.value) {
                        this.filters[id.toLowerCase()] = element.value;
                    } else {
                        delete this.filters[id.toLowerCase()];
                    }
                    this.loadData();
                });
            }
        });
    }

    initializeResetButton() {
        const resetButton = document.getElementById('resetFilters');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    resetFilters() {
        const filterIds = [
            'endYear',
            'topic',
            'sector',
            'region',
            'pestle',
            'source',
            'country',
            'city'
        ];
        
        filterIds.forEach(id => {
            const element = document.getElementById(id + 'Filter');
            if (element) {
                element.value = '';
            }
        });

        this.filters = {};
        this.loadData();
    }

    loadData() {
        // Convert filters object to URL parameters
        const params = new URLSearchParams();
        
        // Handle multiple values for each filter
        Object.entries(this.filters).forEach(([key, values]) => {
            if (Array.isArray(values)) {
                values.forEach(value => {
                    params.append(key, value);
                });
            } else {
                params.append(key, values);
            }
        });

        fetch(`/api/data?${params}`)
            .then(response => response.json())
            .then(data => {
                this.data = data;
                this.updateCharts();
            })
            .catch(error => console.error('Error loading data:', error));
    }

    updateCharts() {
        // Create intensity chart
        Charts.intensityByRegion(this.data, '#intensityChart');
        
        // Create likelihood chart (we'll implement this next)
        Charts.likelihoodByYear(this.data, '#likelihoodChart');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
}); 
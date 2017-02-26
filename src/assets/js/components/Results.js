import Store from 'es6-store';

export default class ZooplaResults {

    constructor(options) {

        if (!options.el) {
            return false;
        }

        this.el = options.el;

        this.defaults = {
            resultCount: 0,
            dataURL: '/assets/data/data.json',
            storage: new Store('search')
        };

        this.ui = {
            resultCounter: document.querySelector('.zoopla__results-counter span'),
            resultList: document.querySelector('.zoopla__results-wrapper')
        };

        this.searchValue = this.defaults.storage.get();
        this.searchValue = this.searchValue.postcode.toUpperCase(); // Retrieve the stored search and standardize the format (String + Uppercase)

        this.initialize();


    }

    initialize() {

        this.retrieveData().then(res => {
            this.dataSet = res;
            this.lookUp(this.searchValue);
        });

    }

    /**
     * Fetch the standalone object
     * Check the validity of the json format
     * @return {Promise.<TResult>}
     */
    retrieveData() {

        return fetch(this.defaults.dataURL).then(response => {
            if (response.ok) {
                const contentType = response.headers.get('Content-Type') || '';

                if (contentType.includes('application/json')) {
                    return response.json().catch(error => {
                        return Promise.reject(new ResponseError('Invalid JSON: ' + error.message));
                    });
                }
            }
        });
    }

    /**
     * Retrieve the current postcode and manipulate the page
     * Updates the result counter on top of the list
     * Clear the result wrapper from old content
     * Update the view looping through all the results and generating the template using the ES6 template syntax.
     * @param value { string } - The postcode passed by our Local Storage.
     */
    lookUp(value) {

        if (this.dataSet.area !== value) {
            window.location.pathname = '/search';
        } else {
            this.ui.resultCounter.innerText = this.dataSet.result_count ? this.dataSet.result_count : this.defaults.resultCount;
        }

        this.ui.resultList.innerHTML = ''; // clear the result list
        this.results = '';

        for (let result of this.dataSet.listing) {
            this.results += this.constructor.buildTemplate(result);
        }

        this.ui.resultList.innerHTML = this.results; // inject the new list

    }

    /**
     * Generate the HTML chunk of a single result
     * @param result { Object } - The listing element
     * @return {string} - The html string to inject inside the result template
     */
    static buildTemplate(result) {
        return `<li class="zoopla__results-item row">
                    <div class="zoopla__results-picture col-sm-6 col-lg-5">
                        <img src="${result.image_url}" alt="${result.property_type}">
                    </div>
                    <div class="zoopla__results-detail col-sm-6 col-lg-5">
                        <h2>${result.num_bedrooms} bedroom ${result.property_type} for sale</h2>
                        <h3>£${result.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>
                        <p>${result.description}</p>
                    </div>
                    <div class="zoopla__results-agentbox col-sm-12 col-lg-2">
                        <img class="zoopla__results-agentlogo" src="${result.agent_logo}" />
                        
                        <p class="zoopla__results-agentname">${result.agent_name}</p>
                        <p class="zoopla__results-agentaddress">${result.agent_address} ${result.agent_postcode}</p>
                        <p class="zoopla__results-agentphone">T: ${result.agent_phone}</p>
                    </div>
                </li>`;
    }


}

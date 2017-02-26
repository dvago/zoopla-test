import Store from 'es6-store';

export default class ZooplaFinder {

    constructor(options) {

        if(!options.el) {
            return false;
        }

        this.el = options.el;

        this.defaults = {
            storage: new Store('search')
        };

        this.ui = {
            noResultsTitle: this.el.querySelector('.zoopla__finder-noresult'),
            searchTitle:this.el.querySelector('.zoopla__finder-title'),
            searchButton: this.el.querySelector('.js-zoopla__finder-button'),
            searchInput: this.el.querySelector('.js-zoopla__finder-input')
        };

        this.initialize();

    }


    initialize() {

        this.checkReturningResult();

        this.attachEvents();
    }

    /**
     * Attach the events to the UI
     */
    attachEvents() {

        this.ui.searchButton.addEventListener('click', (e) => {
            this.searchValue(this.ui.searchInput.value);
        });

        this.ui.searchInput.addEventListener('keyup', (e) => {

            if(e.which !== 13) { // if the key pressed is not enter than give up!
                return false;
            }

            this.searchValue(this.ui.searchInput.value);
        });

    }

    /**
     * Retrieve the stored search value
     * If the store value is not undefined or the postcode is not n11 (this must be refactored)
     * Then hide the page title and show the No results block
     */
    checkReturningResult() {
        let searchValue = this.defaults.storage.get();

        if(searchValue.postcode && searchValue.postcode !== 'n11') { // Returning from a no result page

            this.defaults.storage.clear();

            this.ui.searchTitle.setAttribute('aria-hidden', true);
            this.ui.noResultsTitle.setAttribute('aria-hidden', false);

        }
    }

    /**
     * Clear current search value and store the new one for the results page
     * @param postcode
     */
    searchValue(postcode) {

        this.defaults.storage.clear('search');
        this.defaults.storage.set('postcode', postcode);

        window.location.pathname ='/results';

    }



}

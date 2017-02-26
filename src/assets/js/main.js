import ZooplaFinder from './components/Finder';
import ZooplaResults from './components/Results';

const UI = {
    finder: document.querySelector('.zoopla__finder'),
    results: document.querySelector('.zoopla__results')
};


(function () {

    if(UI.finder) {

        new ZooplaFinder({
            el: UI.finder
        });

    }

    if (UI.results) {

        new ZooplaResults({
            el: UI.results
        });
    }

})();

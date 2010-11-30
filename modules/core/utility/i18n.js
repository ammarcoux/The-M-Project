// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      29.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('core/foundation/object.js');

/**
 * @class
 *
 * Object for internationalisation and localisation.
 */
M.I18N = M.Object.extend({

    /**
     * The type of this object.
     *
     * @property {String}
     */
    type: 'M.I18N',

    /**
     * The default language.
     *
     * @property {String}
     */
    defaultLanguage: 'en_US',

    /**
     * This property is used to map the navigator's language to an ISO standard
     * if necessary. E.g. 'de' will be mapped to 'de_DE'.
     *
     * @property {Object}
     */
    languageMapper: {
        de: ['de_DE'],
        en: ['en_US', 'en_GB']
    },

    /**
     * This property is used to set the language programmatically out of M.Application.
     *
     * @property {String}
     */
    forceLanguage: null,

    /**
     * This method returns the localized string for the given key based on
     * the current language.
     *
     * @param key {String} The key to the localized string.
     */
    l: function(key) {
        return this.localize(key);
    },

    /**
     * This method returns the localized string for the given key based on
     * the current language. It is internally used as a wrapper for l() for
     * a better readability.
     *
     * @private
     * @param key {String} The key to the localized string.
     */
    localize: function(key) {
        if(!M.Application.currentLanguage) {
            M.Application.currentLanguage = this.getLanguage();
        }
        if(this[M.Application.currentLanguage]) {
            if(this[M.Application.currentLanguage][key]) {
                return this[M.Application.currentLanguage][key];        
            } else {
                M.Logger.log('Key \'' + key + '\' not defined for language \'' + M.Application.currentLanguage + '\'', M.WARN);
            }
        } else {
            M.Logger.log('Key \'' + key + '\' not defined for language \'' + M.Application.currentLanguage + '\'', M.WARN);
        }

    },

    /**
     * This method sets the applications current language and forces it to reload.
     *
     * @param language {String} The language to be set.
     */
    setLanguage: function(language) {
        if(!this.isLanguageAvailable(language)) {
            return;
        }
        
        var url = location.protocol + '//' + location.host + location.pathname;

        var oldParams = location.search ? location.search.substring(1).split('&') : null;
        var newParams = '';
        if(oldParams) {
            for(var i in oldParams) {
                var params = oldParams[i].split('=');
                if(params[0] !== 'language') {
                    newParams += newParams ? oldParams[i] : '?' + oldParams[i];
                }
            }
        }
        newParams += newParams ? '&' : '?';

        url += newParams + 'language=' + language;
        url += location.hash;

        location.href = url;
    },

    getLanguage: function() {
        var language = location.search ? location.search.substring(location.search.lastIndexOf("language=") + 9) : null;

        if(language) {
            return language;
        } else if(navigator) {
            var regexResult = /([a-zA-Z]{2,3})[\s_.-]?([a-zA-Z]{2,3})?/.exec(navigator.language);
            if(regexResult && this[regexResult[0]]) {
                return regexResult[0];
            } else if(regexResult && regexResult[1] && this.languageMapper[regexResult[1]]) {
                for(var i in this.languageMapper[regexResult[1]]) {
                    var language = this.languageMapper[regexResult[1]][i];
                    if(this[language]) {
                        return language;
                    }
                }
            } else {
                return M.Application.defaultLanguage;
            }
        } else {
            return M.Application.defaultLanguage;
        }
    },

    /**
     * This method checks if the passed language is available within the app or not. 
     *
     * @param language {String} The language to be checked.
     */
    isLanguageAvailable: function(language) {
        if(this[language] && typeof(this[language]) === 'object') {
            return true;
        } else {
            M.Logger.log('no language \'' + language + '\' specified.', M.WARN);
            return false;
        }
    }

});
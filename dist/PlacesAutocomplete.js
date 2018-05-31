'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultStyles = require('./defaultStyles');

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Copyright (c) 2017 Ken Hibino.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the MIT License (MIT).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * See https://kenny-hibino.github.io/react-places-autocomplete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var PlacesAutocomplete = function (_Component) {
  _inherits(PlacesAutocomplete, _Component);

  function PlacesAutocomplete(props) {
    _classCallCheck(this, PlacesAutocomplete);

    var _this = _possibleConstructorReturn(this, (PlacesAutocomplete.__proto__ || Object.getPrototypeOf(PlacesAutocomplete)).call(this, props));

    _this.state = {
      autocompleteItems: [],
      isTouchMove: false,
    };

    _this.autocompleteCallback = _this.autocompleteCallback.bind(_this);
    _this.textSearchCallback = _this.textSearchCallback.bind(_this);
    _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.debouncedFetchPredictions = (0, _lodash2.default)(_this.fetchPredictions, _this.props.debounce);
    _this.debouceFetchTextSearchPlaces = (0, _lodash2.default)(_this.fetchTextSearchPlaces, _this.props.debounce);
    return _this;
  }

  _createClass(PlacesAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!window.google) {
        throw new Error('Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library');
      }

      if (!window.google.maps.places) {
        throw new Error('Google Maps Places library must be loaded. Please add `libraries=places` to the src URL. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library');
      }

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
      this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK;
    }
  }, {
    key: 'autocompleteCallback',
    value: function autocompleteCallback(predictions, status) {
      if (status != this.autocompleteOK) {
        this.props.onError(status);
        if (this.props.clearItemsOnError) {
          this.clearAutocomplete();
        }
        return;
      }

      // transform snake_case to camelCase
      var formattedSuggestion = function formattedSuggestion(structured_formatting) {
        return {
          mainText: structured_formatting.main_text,
          secondaryText: structured_formatting.secondary_text
        };
      };

      var highlightFirstSuggestion = this.props.highlightFirstSuggestion;


      this.setState({
        autocompleteItems: predictions.map(function (p, idx) {
          return {
            suggestion: p.description,
            placeId: p.place_id,
            active: !!(highlightFirstSuggestion && idx === 0),
            index: idx,
            formattedSuggestion: formattedSuggestion(p.structured_formatting)
          };
        })
      });
    }
  }, {
    key: 'textSearchCallback',
    value: function textSearchCallback(places, status) {
      if (status != this.autocompleteOK) {
        this.props.onError(status);
        if (this.props.clearItemsOnError) {
          this.clearAutocomplete();
        }
        return;
      }

      // transform snake_case to camelCase
      var formattedSuggestion = function formattedSuggestion(structured_formatting) {
        return {
          mainText: structured_formatting.name,
          secondaryText: structured_formatting.formatted_address
        };
      };

      var highlightFirstSuggestion = this.props.highlightFirstSuggestion;


      this.setState({
        autocompleteItems: places.map(function (p, idx) {
          return {
            suggestion: p.name,
            placeId: p.place_id,
            active: !!(highlightFirstSuggestion && idx === 0),
            index: idx,
            formattedSuggestion: formattedSuggestion(p)
          };
        })
      });
    }
  }, {
    key: 'fetchPredictions',
    value: function fetchPredictions() {
      var value = this.props.inputProps.value;

      if (value.length) {
        this.autocompleteService.getPlacePredictions(_extends({}, this.props.options, {
          input: value
        }), this.autocompleteCallback);
      }
    }
  }, {
    key: 'fetchTextSearchPlaces',
    value: function fetchTextSearchPlaces() {
      var value = this.props.inputProps.value;

      if (value.length) {
        this.placesService.textSearch({
          query: value
        }, this.textSearchCallback);
      }
    }
  }, {
    key: 'clearAutocomplete',
    value: function clearAutocomplete() {
      this.setState({ autocompleteItems: [] });
    }
  }, {
    key: 'selectAddress',
    value: function selectAddress(address, placeId, item) {
      var _this2 = this;

      this.clearAutocomplete();
      this.handleSelect(address, placeId);
      if (placeId) {
        this.placesService.getDetails({ placeId: placeId }, function (place, status) {
          var changes = { address: address, google_place_id: placeId };
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            var name = place.name;
            var addr = place.formatted_address;
            var timezone = place.utc_offset / 60;
            changes = _extends({}, changes, { lat: lat, lng: lng, name: name, addr: addr, timezone: timezone });
          }

          _this2.handleDetailFetched(address, changes);
        });
      } else {
        var lat = +item.lat;
        var lng = +item.lng;
        var name = item.formattedSuggestion && item.formattedSuggestion.mainText;
        var addr = item.formattedSuggestion && item.formattedSuggestion.secondaryText;
        var timezone = item.timezone;
        var info = { lat: lat, lng: lng, name: name, addr: addr, address: addr, timezone: timezone };
        this.handleDetailFetched(address, info);
      }
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(address, placeId) {
      this.props.onSelect ? this.props.onSelect(address, placeId) : this.props.inputProps.onChange(address);
    }
  }, {
    key: 'handleDetailFetched',
    value: function handleDetailFetched(address, fetchedLocation) {
      this.props.onDetailFetched ? this.props.onDetailFetched(address, fetchedLocation) : this.props.inputProps.onChange(address);
    }
  }, {
    key: 'getActiveItem',
    value: function getActiveItem() {
      return this.state.autocompleteItems.find(function (item) {
        return item.active;
      });
    }
  }, {
    key: 'selectActiveItemAtIndex',
    value: function selectActiveItemAtIndex(index) {
      var activeName = this.state.autocompleteItems.find(function (item) {
        return item.index === index;
      }).suggestion;
      this.setActiveItemAtIndex(index);
      this.props.inputProps.onChange(activeName);
    }
  }, {
    key: 'handleEnterKey',
    value: function handleEnterKey() {
      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.handleEnterKeyWithoutActiveItem();
      } else {
        this.selectAddress(activeItem.suggestion, activeItem.placeId, activeItem);
      }
    }
  }, {
    key: 'handleEnterKeyWithoutActiveItem',
    value: function handleEnterKeyWithoutActiveItem() {
      if (this.props.onEnterKeyDown) {
        this.props.onEnterKeyDown(this.props.inputProps.value);
        this.clearAutocomplete();
      } else {
        this.debouceFetchTextSearchPlaces();
        this.clearAutocomplete();
      }
    }
  }, {
    key: 'handleDownKey',
    value: function handleDownKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(0);
      } else {
        var nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length;
        this.selectActiveItemAtIndex(nextIndex);
      }
    }
  }, {
    key: 'handleUpKey',
    value: function handleUpKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1);
      } else {
        var prevIndex = void 0;
        if (activeItem.index === 0) {
          prevIndex = this.state.autocompleteItems.length - 1;
        } else {
          prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length;
        }
        this.selectActiveItemAtIndex(prevIndex);
      }
    }
  }, {
    key: 'handleInputKeyDown',
    value: function handleInputKeyDown(event) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          this.handleEnterKey();
          break;
        case 'ArrowDown':
          event.preventDefault(); // prevent the cursor from moving
          this.handleDownKey();
          break;
        case 'ArrowUp':
          event.preventDefault(); // prevent the cursor from moving
          this.handleUpKey();
          break;
        case 'Escape':
          this.clearAutocomplete();
          break;
      }

      if (this.props.inputProps.onKeyDown) {
        this.props.inputProps.onKeyDown(event);
      }
    }
  }, {
    key: 'setActiveItemAtIndex',
    value: function setActiveItemAtIndex(index) {
      this.setState({
        autocompleteItems: this.state.autocompleteItems.map(function (item, idx) {
          if (idx === index) {
            return _extends({}, item, { active: true });
          }
          return _extends({}, item, { active: false });
        })
      });
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus(event) {
      var _props = this.props,
          initialLocations = _props.initialLocations,
          highlightFirstSuggestion = _props.highlightFirstSuggestion,
          selectedLocale = _props.selectedLocale;


      var formattedSuggestion = function formattedSuggestion(location) {
        return {
          mainText: location['name' + selectedLocale],
          secondaryText: location.address
        };
      };

      if (!event.target.value && !!initialLocations) {
        this.setState({
          autocompleteItems: initialLocations.map(function (location, idx) {
            return {
              suggestion: location['name' + selectedLocale],
              placeId: location.googlePlaceId,
              lat: location.latitude,
              lng: location.longitude,
              active: !!(highlightFirstSuggestion && idx === 0),
              index: idx,
              formattedSuggestion: formattedSuggestion(location),
              timezone: location.timezone
            };
          })
        });
      }
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(event) {
      this.props.inputProps.onChange(event.target.value);
      if (!event.target.value) {
        this.clearAutocomplete();
        return;
      }
      this.debouncedFetchPredictions();
    }
  }, {
    key: 'handleInputOnBlur',
    value: function handleInputOnBlur(event) {
      this.clearAutocomplete();

      if (this.props.inputProps.onBlur) {
        this.props.inputProps.onBlur(event);
      }
    }
  }, {
    key: 'inlineStyleFor',
    value: function inlineStyleFor() {
      var _props2 = this.props,
          classNames = _props2.classNames,
          styles = _props2.styles;
      // No inline style if className is passed via props for the element.

      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      if (props.some(function (prop) {
        return classNames.hasOwnProperty(prop);
      })) {
        return {};
      }

      return props.reduce(function (acc, prop) {
        return _extends({}, acc, _defaultStyles2.default[prop], styles[prop]);
      }, {});
    }
  }, {
    key: 'classNameFor',
    value: function classNameFor() {
      var classNames = this.props.classNames;

      for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }

      return props.reduce(function (acc, prop) {
        var name = classNames[prop] || '';
        return name ? acc + ' ' + name : acc;
      }, '');
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var _this3 = this;

      var defaultInputProps = {
        type: 'text',
        autoComplete: 'off'
      };

      return _extends({}, defaultInputProps, this.props.inputProps, {
        onFocus: function onFocus(event) {
          _this3.handleFocus(event);
        },
        onChange: function onChange(event) {
          _this3.handleInputChange(event);
        },
        onKeyDown: function onKeyDown(event) {
          _this3.handleInputKeyDown(event);
        },
        onBlur: function onBlur(event) {
          _this3.handleInputOnBlur(event);
        },
        style: this.inlineStyleFor('input'),
        className: this.classNameFor('input')
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props3 = this.props,
          classNames = _props3.classNames,
          styles = _props3.styles;
      var autocompleteItems = this.state.autocompleteItems;

      var inputProps = this.getInputProps();

      return _react2.default.createElement(
        'div',
        {
          id: 'PlacesAutocomplete__root',
          style: this.inlineStyleFor('root'),
          className: this.classNameFor('root')
        },
        _react2.default.createElement('input', inputProps),
        autocompleteItems.length > 0 && _react2.default.createElement(
          'div',
          {
            id: 'PlacesAutocomplete__autocomplete-container',
            style: this.inlineStyleFor('autocompleteContainer'),
            className: this.classNameFor('autocompleteContainer')
          },
          autocompleteItems.map(function (p, idx) {
            return _react2.default.createElement(
              'div',
              {
                key: p.placeId || p.suggestion || p.index || idx,
                onMouseOver: function onMouseOver() {
                  return _this4.setActiveItemAtIndex(p.index);
                },
                onMouseDown: function onMouseDown(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  _this4.selectAddress(p.suggestion, p.placeId, p);
                },
                onTouchStart: function onTouchStart() {
                  _this4.setState({isTouchMove: false});
                  return _this4.setActiveItemAtIndex(p.index);
                },
                onTouchMove: function onTouchMove() {
                  _this4.setState({isTouchMove: true});
                },
                onTouchEnd: function onTouchEnd(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!_this4.state.isTouchMove) {
                    _this4.selectAddress(p.suggestion, p.placeId, p);
                  }
                  _this4.setState({isTouchMove: false});
                },
                style: p.active ? _this4.inlineStyleFor('autocompleteItem', 'autocompleteItemActive') : _this4.inlineStyleFor('autocompleteItem'),
                className: p.active ? _this4.classNameFor('autocompleteItem', 'autocompleteItemActive') : _this4.classNameFor('autocompleteItem')
              },
              _this4.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })
            );
          }),
          this.props.googleLogo && _react2.default.createElement(
            'div',
            {
              id: 'PlacesAutocomplete__google-logo',
              style: this.inlineStyleFor('googleLogoContainer'),
              className: this.classNameFor('googleLogoContainer')
            },
            _react2.default.createElement('img', {
              src: require('./images/powered_by_google_' + this.props.googleLogoType + '.png'),
              style: this.inlineStyleFor('googleLogoImage'),
              className: this.classNameFor('googleLogoImage')
            })
          )
        )
      );
    }
  }]);

  return PlacesAutocomplete;
}(_react.Component);

PlacesAutocomplete.propTypes = {
  inputProps: function inputProps(props, propName) {
    var inputProps = props[propName];

    if (!inputProps.hasOwnProperty('value')) {
      throw new Error('\'inputProps\' must have \'value\'.');
    }

    if (!inputProps.hasOwnProperty('onChange')) {
      throw new Error('\'inputProps\' must have \'onChange\'.');
    }
  },
  onError: _propTypes2.default.func,
  clearItemsOnError: _propTypes2.default.bool,
  onSelect: _propTypes2.default.func,
  autocompleteItem: _propTypes2.default.func,
  classNames: _propTypes2.default.shape({
    root: _propTypes2.default.string,
    input: _propTypes2.default.string,
    autocompleteContainer: _propTypes2.default.string,
    autocompleteItem: _propTypes2.default.string,
    autocompleteItemActive: _propTypes2.default.string
  }),
  styles: _propTypes2.default.shape({
    root: _propTypes2.default.object,
    input: _propTypes2.default.object,
    autocompleteContainer: _propTypes2.default.object,
    autocompleteItem: _propTypes2.default.object,
    autocompleteItemActive: _propTypes2.default.object
  }),
  options: _propTypes2.default.shape({
    bounds: _propTypes2.default.object,
    componentRestrictions: _propTypes2.default.object,
    location: _propTypes2.default.object,
    offset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    radius: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    types: _propTypes2.default.array
  }),
  debounce: _propTypes2.default.number,
  highlightFirstSuggestion: _propTypes2.default.bool,
  googleLogo: _propTypes2.default.bool,
  googleLogoType: _propTypes2.default.oneOf(['default', 'inverse'])
};

PlacesAutocomplete.defaultProps = {
  clearItemsOnError: false,
  onError: function onError(status) {
    return console.error('[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ', status);
  },
  classNames: {},
  autocompleteItem: function autocompleteItem(_ref) {
    var suggestion = _ref.suggestion,
        formattedSuggestion = _ref.formattedSuggestion;
    return _react2.default.createElement(
      'div',
      null,
      formattedSuggestion.mainText || suggestion,
      formattedSuggestion.secondaryText ? _react2.default.createElement(
        'span',
        { className: 'text-muted', style: { display: 'block' } },
        formattedSuggestion.secondaryText
      ) : null
    );
  },
  styles: {},
  options: {},
  debounce: 200,
  highlightFirstSuggestion: false,
  googleLogo: true,
  googleLogoType: 'default'
};

exports.default = PlacesAutocomplete;
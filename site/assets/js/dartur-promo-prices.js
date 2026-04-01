let PROMO_DOMAIN = ''
let PROMO_TOKEN = ''
let PROMO_PRICE_SERVER = ''
let PROMO_PROTOCOL = ''


function PromoPrice() {
    this.domain = '';
    this.token = '';
    this.price_server = '';
    this.protocol = 'http'

    this.run = function () {

        var domain = this.domain;
        var token = this.token;
        var price_server = this.price_server;
        var protocol = 'http'

        if (this.protocol !== undefined) {
            protocol = this.protocol;
        }

        PROMO_DOMAIN = domain
        PROMO_TOKEN = token
        PROMO_PRICE_SERVER = price_server
        PROMO_PROTOCOL = protocol

        if (jQuery(".block_promo_prices").length > 0) {
            jQuery('.block_promo_prices').each(function (i, obj) {
                var region_id = parseInt(jQuery(obj).attr("region"));
                var rule_id = parseInt(jQuery(obj).attr("rule_id"));
                var limit = parseInt(jQuery(obj).attr("limit"));

                get_promo_prices(domain, token, price_server, region_id, rule_id, limit, obj, protocol);
            });
        }

        if (jQuery(".block_promo_prices").length > 0) {
            jQuery('.block_promo_prices').each(function (i, obj) {
                var category_id = parseInt(jQuery(obj).attr("category_id"));
                var limit = parseInt(jQuery(obj).attr("limit"));

                if (category_id > 0) {
                    get_hot_prices(domain, token, price_server, category_id, limit, obj, protocol);
                }
            });
        }

        if (jQuery(".block_excursion_promo_prices").length > 0) {
            jQuery('.block_excursion_promo_prices').each(function (i, obj) {
                var rule_id = parseInt(jQuery(obj).attr("rule_id"));
                var limit = parseInt(jQuery(obj).attr("limit"));
                get_excursion_promo_prices(domain, token, price_server, rule_id, limit, obj, protocol);
            });
        }

    }
}


function add_more_promo_prices(category_id) {
    if (jQuery('.block_promo_prices[category_id="' + category_id + '"]').length > 0) {
        var obj = jQuery('.block_promo_prices[category_id="' + category_id + '"]')
        get_hot_prices(PROMO_DOMAIN, PROMO_TOKEN, PROMO_PRICE_SERVER, category_id, parseInt(jQuery(obj).attr("limit")), obj, PROMO_PROTOCOL);
    }
}

function get_hot_prices(domain, token, price_server, category_id, limit, obj, protocol) {

    var url = protocol + "://api." + domain;
    var photo_server = protocol + "://photos." + domain;

    var lang = jQuery('html')[0].lang;


    var days = 'days';
    var nights = 'nights';
    var per_person = 'per person';
    var fromh = 'from';
    var forh = 'for';
    var sys_lang = 'ru';

    if (lang === 'ru-ru' || lang === 'ru' || lang === 'ru-RU') {
        days = "дней";
        nights = "ночей";
        per_person = "за человека";
        fromh = "с";
        forh = "за";
        sys_lang = 'ru';
    }
    if (lang === 'ro-ro' || lang === 'ro' || lang === 'ro-RO') {
        days = "zile";
        nights = "nopți";
        per_person = "pe persoană";
        fromh = "de la";
        forh = "pentru";
        sys_lang = 'ro';
    }
    if (lang === 'en-gb' || lang === 'en-en') {
        days = "days";
        nights = "nights";
        per_person = "per person";
        fromh = "from";
        forh = "for";
        sys_lang = 'en';
    }

    url = url + "/post/get_posts"
    var params = {
        category_id: category_id,
        limit: limit,
        offset: jQuery(obj).find('.description-wrapper').length,
        lang: sys_lang
    }

    jQuery.ajax({
        url: url,
        xhr: function () {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function (name, value) {
                if (name === 'X-CSRF-Token') return;
                if (name === 'x-csrf-token') return;
                setRequestHeader.call(this, name, value);
            }
            // pass it on to jQuery
            return xhr;
        },
        method: "GET",

        data: params,

        success: function (result) {

            var prices = result;

            console.log(prices)

            _.each(prices, function (price) {

                var trans_fields = jQuery.parseJSON(price.translated_fields)
                var fields = jQuery.parseJSON(price.fields)

                console.log("----------------Новый блок----------------")
                console.log("price", price)
                console.log("trans_fields", trans_fields)
                console.log("fields", fields)
                //
                //
                var service = 'hotel'

                if (parseInt(fields['module_id']) === 5) {
                    service = 'excursion'
                }

                var price_html = "";

                var main_photo = ''

                if (price.cover === undefined || price.cover === null || price.cover === '') {
                    main_photo = 'no'
                } else {
                    main_photo = photo_server + "/" + price.cover
                }

                // var price_url = protocol + '://' + price_server + '/book/package_search_remote/search_by_rule/' + price["GroupHotelId"] + '/' + id + '/' + token + '/' + sys_lang

                var unformat_date = fields['date_from'].split("-");
                from_date = unformat_date[2] + "." + unformat_date[1] + "." + unformat_date[0];

                var placement_name = ''

                var price_per_person = fields['price'];

                description = "<div class='description-prop-price'><span class='icon'></span> " + price_per_person + "</div>"
                description += "<div class='description-wrapper'>"
                description += "<div class='description-prop-hotel2'>" + text_truncate(price['title'], 30) + "</div>";
                description += "<div class='description-prop-category'>" + price['title'] + "</div>";
                description += "<div class='description-prop-hotel2_full'>" + text_truncate(price['title'], 30) + "</div>";
                description += "<div class='description-prop-category_full'>" + price['title'] + "</div>";
                description += "<div class='description-prop-hotel'>"+trans_fields['promo_title']+"</div>";
                description += "<div class='description-prop-date'><i class='fa fa-calendar'></i> " + from_date + "</div>"
                description += "<div class='description-prop-placement'><i class='fas fa-users'></i> " + placement_name + "</div>"
                description += "<div class='description-prop-price-per-person'><span class='icon'></span> </div>"
                description += "<div class='description-prop-description'> " + price.description + " </div>"
                description += "</div>"


                var description_photo = ''

                if (main_photo === 'no') {
                    price_html += "<div class='promo_item_hotel_photo no_photo_class'> " + description + " </div>";
                } else {
                    price_html += "<div class='promo_item_hotel_photo' style='background-image: url(" + main_photo + ")'> " + description + " </div>";
                }

                price_html = "<div class='promo_price_item package_wp col-sm-6 col-lg-4 mb-3 mb-sm-3 mb-md-3'><a style='cursor:pointer' class='hot_offer_modal' data-modal='#hot_item_desc" + price.id + "' data-id='" + price.id + "' target='_blank'>" + price_html + "</a></div>"

                jQuery(obj).append(price_html);

                var button = "<div class='event_load_prices'></div>";

                var hotel_modal = "<div class='promo_item_desc' id='hot_item_desc" + price.id + "' data-service='" + service + "' data-lang='" + sys_lang + "' data-protocol='" + protocol + "' data-domain='" + price_server + "' data-hotel='" + 1 + "' data-token='" + token + "' data-rule='" + fields['request_id'] + "' style='display:none; height: 620px;color:black'>" + description_photo + "<div></div>" + " <br> <div id='hot_price_list" + price.id + "'></div> </div>";


                jQuery(obj).append(hotel_modal);

            });

            jQuery(function () {
                jQuery('a.hot_offer_modal[data-modal]').on('click', function () {
                    jQuery(jQuery(this).data('modal')).modal();
                    load_frame_by_request_id(jQuery(this).data('id'));

                    return false;
                })

            });
        }
    });
}

function load_frame_by_request_id(price_id) {
    var hotel_id = jQuery("#hot_item_desc" + price_id).attr("data-hotel");
    var token = jQuery("#hot_item_desc" + price_id).attr("data-token");
    var rule_id = jQuery("#hot_item_desc" + price_id).attr("data-rule");
    var domain = jQuery("#hot_item_desc" + price_id).attr("data-domain");
    var protocol = jQuery("#hot_item_desc" + price_id).attr("data-protocol");
    var lang = jQuery("#hot_item_desc" + price_id).attr("data-lang");
    var service = jQuery("#hot_item_desc" + price_id).attr("data-service");

    console.log("load_frame_by_request_id", price_id, hotel_id, token, rule_id, domain, protocol, lang, service)

    jQuery("#hot_item_desc" + price_id).find('.event_load_prices').html("loading...");

    jQuery("#hot_price_list" + price_id).html(price_id)

    if (service === 'hotel') {
        jQuery("#hot_price_list" + price_id).html('<iframe allowtransparency="true" frameborder="0" scrolling="yes" src="' + protocol + '://' + domain + '/book/package_search_remote/search_by_hot_offer/' + token + '/' + lang + '/' + rule_id + '" style="display: block;" height="570px" width="100%"></iframe>');
    } else {
        jQuery("#hot_price_list" + price_id).html('<iframe allowtransparency="true" frameborder="0" scrolling="yes" src="' + protocol + '://' + domain + '/book/filter_excursion/remote/' + token + '/' + lang + '?price_view_theme=agency&excursion_request_id=' + rule_id + '" style="display: block;" height="570px" width="100%"></iframe>');
    }
}

function get_promo_prices(domain, token, price_server, region_id, rule_id, limit, obj, protocol) {
    if (region_id > 0 && limit > 0) {
        get_prices(domain, price_server, 'region', region_id, limit, token, obj, protocol);
    } else if (rule_id > 0 && limit > 0) {
        get_prices(domain, price_server, 'rule', rule_id, limit, token, obj, protocol);
    }
}

function get_prices(domain, price_server, type, id, limit, token, obj, protocol) {

    var url = protocol + "://api." + domain;
    var photo_server = protocol + "://photos." + domain;


    if (type == 'region') {
        url = url + "/promo/get_prices_by_region_id"
        var params = {region_id: id, limit: limit, token: token}
    } else if (type == 'rule') {
        url = url + "/promo/get_prices_by_rule_id"
        var params = {rule_id: id, limit: limit, token: token}
    }

    var lang = jQuery('html')[0].lang;

    var days = 'days';
    var nights = 'nights';
    var per_person = 'per person';
    var fromh = 'from';
    var forh = 'for';
    var sys_lang = 'en';

    if (lang === 'ru-ru' || lang === 'ru' || lang === 'ru-RU') {
        days = "дней";
        nights = "ночей";
        per_person = "за человека";
        fromh = "с";
        forh = "за";
        sys_lang = 'ru';
    }
    if (lang === 'ro-ro' || lang === 'ro' || lang === 'ro-RO') {
        days = "zile";
        nights = "nopți";
        per_person = "pe persoană";
        fromh = "de la";
        forh = "pentru";
        sys_lang = 'ro';
    }
    if (lang === 'en-gb' || lang === 'en-en') {
        days = "days";
        nights = "nights";
        per_person = "per person";
        fromh = "from";
        forh = "for";
        sys_lang = 'en';
    }

    jQuery.ajax({
        url: url,
        xhr: function () {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function (name, value) {
                if (name === 'X-CSRF-Token') return;
                if (name === 'x-csrf-token') return;
                setRequestHeader.call(this, name, value);
            }
            // pass it on to jQuery
            return xhr;
        },
        method: "POST",

        data: params,

        success: function (result) {

            var prices = jQuery.parseJSON(result);

            _.each(prices, function (price) {

                var price_html = "";

                var photos = price["Photos"]
                var main_photo = 'no';
                var photos_tags = "";

                if (photos) {
                    photos_arr = photos.split(",")
                    if (photos_arr.length > 0) {
                        main_photo = photo_server + "/" + photos_arr[0];

                        _.each(photos_arr, function (photo) {
                            photo = photo_server + "/" + photo;
                            photos_tags += "<img src='" + photo + "' width='100' height='auto' class='promo_hotel_icon'>";
                        });

                    }
                }

                // var price_url = protocol + '://' + price_server + '/book/package_search_remote/search_by_rule/' + price["GroupHotelId"] + '/' + id + '/' + token + '/' + sys_lang

                var unformat_date = price['FromDate'].split("-");
                from_date = unformat_date[2] + "." + unformat_date[1] + "." + unformat_date[0];

                var placement_name = price['PlacementName'].replace("+0 chd", "");
                placement_name =  placement_name.replace("+0chd", "");
                placement_name =  placement_name.replace("+ 0chd", "");

                if (lang === 'ro-ro' || lang === 'ro' || lang === 'ro-RO') {
                    placement_name = placement_name.replace("adl", " adulți");
                    placement_name = placement_name.replace("chd", " copii");
                } else {
                    placement_name = placement_name.replace("adl", " взрослых");
                    placement_name = placement_name.replace("chd", " детей");
                }

                var count_adults = jQuery.trim(placement_name);


                var price_per_person = round(price["Sum"],2);


                if (price['Discount'].indexOf("spo") > -1 || price['Discount'].indexOf("disc") > -1 || price['Discount'].indexOf("extrass") > -1) {
                    price_html += "<div class='promo_item_spo_intern'>SPECIAL OFFER</div>";
                }

                description = "<div class='description-prop-price'><span class='icon'></span> " + price_per_person + "€</div>"
                description += "<div class='description-wrapper'>"
                description += "<div class='description-prop-hotel2'>" + text_truncate(price['HotelName'], 30) + " " + price['CategoryName'] + "</div>";
                description += "<div class='description-prop-category'>" + price["CategoryName"] + "</div>";
                description += "<div class='description-prop-hotel2_full'>" + text_truncate(price['HotelName'], 30) + " " + price['CategoryName'] + "</div>";
                description += "<div class='description-prop-category_full'>" + price["CategoryName"] + "</div>";
                description += "<div class='description-prop-hotel'>" + price['ResortName'] + "</div>";
                description += "<div class='description-prop-date'><i class='fa fa-calendar'></i> " + from_date + "</div>"
                description += "<div class='description-prop-placement'><i class='fas fa-users'></i> " + placement_name + "</div>"
                description += "<div class='description-prop-price-per-person'><span class='icon'></span> </div>"
                description += "<div class='description-prop-nights'><i class='fas fa-moon'></i> " + (parseInt(price['Nights']) + 1) + " " + days + " -  " + price['Nights'] + " " + nights + "</div>"
                description += "<div class='description-prop-food'><i class='fas fa-utensils'></i> " + price["FoodName"] + "</div>"
                description += "<div class='description-prop-room'><i class='fas fa-bed'></i> " + price["TypeRoomName"] + "</div>"
                description += "</div>"


                if (main_photo === 'no') {
                    price_html += "<div class='promo_item_hotel_photo no_photo_class'> " + description + " </div>";
                } else {
                    price_html += "<div class='promo_item_hotel_photo' style='background-image: url(" + main_photo + ")'> " + description + " </div>";
                }

                price_html = "<div class='promo_price_item package_promo'><a style='cursor:pointer' data-modal='#promo_item_desc" + price["Id"] + "' data-id='" + price["Id"] + "' target='_blank'>" + price_html + "</a></div>"

                if (obj === undefined) {
                    jQuery("#block_promo_prices").append(price_html);
                } else {
                    jQuery(obj).append(price_html);
                }

                var hotel_desc = "<div class='promo_item_desc'>" + price["HotelDescription"] + "</div>";
                var hotel_desc_name = "<div class='promo_item_desc_hotel_name'>" + price["HotelName"] + " " + price["CategoryName"] + "</div>";
                var hotel_desc_photos = "<div class='promo_item_desc_photos'>" + photos_tags + "</div>";
                var button = "<div class='event_load_prices'></div>";

                var hotel_modal = "<div class='promo_item_desc' id='promo_item_desc" + price["Id"] + "' data-lang='" + sys_lang + "' data-protocol='" + protocol + "' data-domain='" + price_server + "' data-hotel='" + price["GroupHotelId"] + "' data-token='" + token + "' data-rule='" + id + "' style='display:none; height: 620px'>" + button + " <br> <div id='price_list" + price["Id"] + "'></div> </div>";

                if (obj === undefined) {
                    jQuery("#block_promo_prices").append(hotel_modal);
                } else {
                    jQuery(obj).append(hotel_modal);
                }
            });

            jQuery(function () {
                jQuery('a[data-modal]').on('click', function () {
                    jQuery(jQuery(this).data('modal')).modal();
                    load_list_price(jQuery(this).data('id'));
                    window.parent.postMessage("autoscroll", '*');
                    return false;
                });
            });
        }
    });
}

function round(value, digits) {
    var exp = Math.pow(10, digits);
    return Math.round(value * exp) / exp;
}

function get_excursion_promo_prices(domain, token, price_server, rule_id, limit, obj, protocol) {

    var url = protocol + "://api." + domain;
    var photo_server = protocol + "://photos." + domain;

    // var url = 'http://localhost:8080';
    // var photo_server = 'http://localhost:3000/files';

    url = url + "/promo/get_excursion_offers"
    var params = {rule_id: rule_id, limit: limit, token: token}

    var lang = jQuery('html')[0].lang;

    var days = 'days';
    var nights = 'nights';
    var per_person = 'per person';
    var fromh = 'from';
    var forh = 'for';
    var sys_lang = 'en';

    if (lang === 'ru-ru' || lang === 'ru') {
        days = "дней";
        nights = "ночей";
        per_person = "за человека";
        fromh = "с";
        forh = "за";
        sys_lang = 'ru';
    }
    if (lang === 'ro-ro' || lang === 'ro') {
        days = "zile";
        nights = "nopți";
        per_person = "pe persoană";
        fromh = "de la";
        forh = "pentru";
        sys_lang = 'ro';
    }
    if (lang === 'en-gb' || lang === 'en-en') {
        days = "days";
        nights = "nights";
        per_person = "per person";
        fromh = "from";
        forh = "for";
        sys_lang = 'en';
    }

    jQuery.ajax({
        url: url,
        xhr: function () {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function (name, value) {
                if (name === 'X-CSRF-Token') return;
                if (name === 'x-csrf-token') return;
                setRequestHeader.call(this, name, value);
            }
            // pass it on to jQuery
            return xhr;
        },
        method: "POST",

        data: params,

        success: function (result) {

            var prices = result;

            _.each(prices, function (price) {

                var price_html = "";

                var main_photo = 'no';
                var photos_tag = "";

                if (price['Photo'] !== '') {
                    main_photo = price['Photo'];
                    photo = photo_server + "/" + price['Photo'];
                }

                var price_url = protocol + '://' + price_server + '/book/bundle/new_optim/?price_id=' + price["PriceId"] + '&token=' + price['Session'];
                //var price_url = 'http://localhost:3000/book/bundle/new_optim/?price_id=' + price["PriceId"] + '&token=' + price['Session'];

                var unformat_date = price['FromDate'].split("-");
                from_date = unformat_date[2] + "." + unformat_date[1] + "." + unformat_date[0];

                var count_adults = parseInt(price['Adults'])


                var price_per_person = price["Sum"];


                description = "<div class='description-wrapper'>"
                description += "<div class='description-prop-hotel2' style='line-height: 17px;margin-bottom: 13px;'>" + price['Name'] + "</div>";

                description += "<div class='description-prop-hotel2_full' style='line-height: 17px;margin-bottom: 13px;'>" + price['Name'] + "</div>";
                description += "<div class='description-prop-hotel'>" + price['StateNames'] + " - " + price['ResortNames'] + "</div>";
                description += "<div class='description-prop-date'><span class='icon'></span> " + from_date + "</div>"
                description += "<div class='description-prop-price'><span class='icon'></span> " + price_per_person + "€</div>"
                description += "<div class='description-prop-price-per-person'><span class='icon'></span></div>"
                description += "<div class='description-prop-nights'><span class='icon'></span> " + (parseInt(price['Nights']) + 1) + " " + days + " -  " + price['Nights'] + " " + nights + "</div>"
                description += "<div class='description-prop-food'><span class='icon'></span> " + price["FoodNames"] + "</div>"
                description += "<div class='description-prop-food'> " + price["ShortcutDescription"] + "</div>"
                description += "</div>"

                if (main_photo === 'no') {
                    price_html += "<div class='promo_item_hotel_photo no_photo_class'> " + description + " </div>";
                } else {
                    price_html += "<div class='promo_item_hotel_photo' style='background-image: url(" + photo + ")'> " + description + " </div>";
                }

                price_html = "<div class='promo_price_item'><a style='cursor:pointer;text-decoration: none' href='" + price_url + "' target='_blank'>" + price_html + "</a></div>"

                if (obj === undefined) {
                    jQuery("#block_promo_prices").append(price_html);
                } else {
                    jQuery(obj).append(price_html);
                }

            });

        }
    });
}


function load_list_price(price_id) {
    var hotel_id = jQuery("#promo_item_desc" + price_id).attr("data-hotel");
    var token = jQuery("#promo_item_desc" + price_id).attr("data-token");
    var rule_id = jQuery("#promo_item_desc" + price_id).attr("data-rule");
    var domain = jQuery("#promo_item_desc" + price_id).attr("data-domain");
    var protocol = jQuery("#promo_item_desc" + price_id).attr("data-protocol");
    var lang = jQuery("#promo_item_desc" + price_id).attr("data-lang");

    jQuery("#promo_item_desc" + price_id).find('.event_load_prices').html("loading...");
    jQuery("#price_list" + price_id).html('<iframe allowtransparency="true" onload="event_end(' + price_id + ')" frameborder="0" scrolling="yes" src="' + protocol + '://' + domain + '/book/package_search_remote/search_by_rule/' + hotel_id + '/' + rule_id + '/' + token + '/' + lang + '" style="display: block;" height="570px" width="100%"></iframe>');
}


function event_end(price_id) {
    jQuery("#promo_item_desc" + price_id).find('.event_load_prices').html("");
}

text_truncate = function (str, length, ending) {
    if (length === null) {
        length = 100;
    }
    if (ending === null) {
        ending = '...';
    }
    if (ending === undefined) {
        ending = '...';
    }
    if (toString(str).length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};
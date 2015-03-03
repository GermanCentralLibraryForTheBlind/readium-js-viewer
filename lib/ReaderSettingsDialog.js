define(['hgn!templates/settings-dialog.html', 'ReaderSettingsDialog_Keyboard', 'i18n/Strings', 'Dialogs', 'storage/Settings', 'Keyboard', 'colpick', 'bootstrap'], function(SettingsDialog, KeyboardSettings, Strings, Dialogs, Settings, Keyboard){
	var defaultSettings = {
        fontSize: 100,
        syntheticSpread: "auto",
        scroll: "auto",
        columnGap: 60
    }
    
    var getBookStyles = function(readerSettings){
        var isAuthorTheme = readerSettings.theme === "author-theme";
    	var $previewText = $('.preview-text');
    	setPreviewTheme($previewText, readerSettings);
    	var previewStyle = window.getComputedStyle($previewText[0]);
    	var bookStyles = [{selector: 'body', declarations: {
            backgroundColor: isAuthorTheme ? "" : previewStyle.backgroundColor,
            color: isAuthorTheme ? "" : previewStyle.color
        }}];
        return bookStyles;
    }
    var setPreviewTheme = function($previewText, readerSettings){
        var previewTheme = $previewText.attr('data-theme');
        var newTheme = readerSettings.theme;
        $previewText.removeClass(previewTheme);
        $previewText.addClass(newTheme);
        $previewText.attr('data-theme', newTheme);
        
        if(isCustomTheme(newTheme))
            setCustomThemeColor($previewText, readerSettings);
        else {
            $previewText.css('color', '').css('background-color', '');
            deleteTemporaryCustomColor();
        }
    }
    
    var setCustomThemeColor = function($element, readerSettings){
        $element.css('color', readerSettings.themeColor.color);
        $element.css('background-color', readerSettings.themeColor.backgroundColor);
    }
    
    
    var isCustomTheme = function(theme){
        return theme == "custom-theme";
    }
    
    var updateReader = function(reader, readerSettings){
        reader.updateSettings(readerSettings); // triggers on pagination changed

        if (readerSettings.theme){
            //$("html").addClass("_" + readerSettings.theme);
            $("html").attr("data-theme", readerSettings.theme);
            
            var bookStyles = getBookStyles(readerSettings);
            reader.setBookStyles(bookStyles);
            $('#reading-area').css(bookStyles[0].declarations);
        }
    }
    
    var updateSliderLabels = function($slider, val, txt, label)
    {
        $slider.attr("aria-valuenow", val+"");
        $slider.attr("aria-value-now", val+"");
        
        $slider.attr("aria-valuetext", txt+"");
        $slider.attr("aria-value-text", txt+"");
        
        $slider.attr("title", label + " " + txt);
        $slider.attr("aria-label", label + " " + txt);
    };
    
    var initCustomThemeDialog = function() {

        $("#custom-theme-btn").on("click", function(){
            $('#settings-dialog').modal('hide');
            $("#custom-theme-dialog").modal('show');
        });

        $("#custom-theme-dialog").on('hidden.bs.modal', function() {
            
            $('#settings-dialog').modal('show'); 
        });

        $("#custom-theme-dialog").on('hide.bs.modal', function() {

            $("#background-color-btn").colpickHide();
            $("#foreground-color-btn").colpickHide();
            $("#tab-style").prepend($("#theme-preview"));
            $previewText.attr('data-theme', 'custom-theme');
            setTemporaryCustomColor();
        });
        
        function rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
        
        $("#custom-theme-dialog").on('show.bs.modal', function() {
            
            $("#custom-theme-dialog-body").prepend($("#theme-preview"));
            
            var rgbFore = $("#custom-theme-btn").css("color");
            var rgbBack = $("#custom-theme-btn").css("background-color");
            
            $("#foreground-color-btn").colpickSetColor(rgb2hex(rgbFore));
            $("#background-color-btn").colpickSetColor(rgb2hex(rgbBack));

        });

        function getContrastColor(hexcolor){

            if(hexcolor[0] == '#')
                hexcolor = hexcolor.substring(1);
            return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
        }
        
        $("#background-color-btn").colpick({
            layout:'hex',
            submit:0,
            colorScheme:'light',
            onChange:function(hsb,hex,rgb,el,bySetColor) {

                hex = '#'+hex;
                $(el).css('color', getContrastColor(hex)).css('background-color', hex);

                $('#custom-theme-btn').css('background-color', hex);
                $('.preview-text').css('background-color', hex);
            }
        });

        $("#foreground-color-btn").colpick({
            layout:'hex',
            submit:0,
            colorScheme:'light',
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                
                hex = '#'+hex;
                $(el).css('color', getContrastColor(hex)).css('background-color', hex);
                
                $('#custom-theme-btn').css('color', hex);
                $('.preview-text').css('color', hex);
            }
        });
    }
    
    function setTemporaryCustomColor() {
        
        localStorage["tempThemeColor"] = {
            color: $previewText.css('color'),
            backgroundColor: $previewText.css('background-color')
        }
    }

    function deleteTemporaryCustomColor() {
        localStorage.removeItem("tempThemeColor");
    }

    function isTemporaryCustomColorSet() {
        return localStorage.hasOwnProperty("tempThemeColor");
    }
    
	var initDialog = function(reader){
		$('#app-container').append(SettingsDialog({strings: Strings, dialogs: Dialogs, keyboard: Keyboard}));

		$previewText = $('.preview-text');
        $('.theme-option').on('click', function(){
            var newTheme = $(this).attr('data-theme');
            setPreviewTheme($previewText, {theme:newTheme});
        });
        
        var $marginSlider = $("#margin-size-input");
        $marginSlider.on("change",
        function() {
            var val = $marginSlider.val();
            
            updateSliderLabels($marginSlider, val, val + "px", Strings.i18n_margins);
        }
        );
        
        var $fontSizeSlider = $("#font-size-input");
        $fontSizeSlider.on('change', function(){
            var fontSize = $fontSizeSlider.val();
            
            $previewText.css({fontSize: (fontSize/100) + 'em'});
            
            updateSliderLabels($fontSizeSlider, fontSize, fontSize + '%', Strings.i18n_font_size);
        });

        $('#tab-butt-main').on('click', function(){
            $("#tab-keyboard").attr('aria-expanded', "false");
            $("#tab-main").attr('aria-expanded', "true");
        });
        $('#tab-butt-keys').on('click', function(){
            $("#tab-main").attr('aria-expanded', "false");
            $("#tab-keyboard").attr('aria-expanded', "true");
        });
        $('#buttSave').on('keydown',function(evt) {
            if(evt.which === 9 && !(evt.shiftKey | evt.ctrlKey | evt.metaKey | evt.altKey)) { // TAB pressed
              evt.preventDefault();
              $('#closeSettingsCross').focus();
            }
        });
        $('#closeSettingsCross').on('keydown',function(evt) {
            if(evt.which === 9 && evt.shiftKey) { // shift-TAB pressed
              evt.preventDefault();
              $('#buttSave').focus();
            }
        });
        
        $('#settings-dialog').on('hide.bs.modal', function(){ // IMPORTANT: not "hidden.bs.modal"!! (because .off() in
        
            // Safety: "save" button click
            setTimeout(function(){
                $("#keyboard-list").empty();
            }, 500);
        });
        
        $('#settings-dialog').on('show.bs.modal', function(){ // IMPORTANT: not "shown.bs.modal"!! (because .off() in library vs. reader context)

            $('#tab-butt-main').trigger("click");
            KeyboardSettings.initKeyboardList();

            setTimeout(function(){ $('#closeSettingsCross')[0].focus(); }, 1000); //tab-butt-main
        
            Settings.get('reader', function(readerSettings){
                readerSettings = readerSettings || defaultSettings;
                for (prop in defaultSettings)
                {
                    if (defaultSettings.hasOwnProperty(prop) && !readerSettings.hasOwnProperty(prop) && !readerSettings[prop])
                    {
                        readerSettings[prop] = defaultSettings[prop];
                    }
                }

                $fontSizeSlider.val(readerSettings.fontSize);
                updateSliderLabels($fontSizeSlider, readerSettings.fontSize, readerSettings.fontSize + '%', Strings.i18n_font_size);
                
                
                $marginSlider.val(readerSettings.columnGap);
                updateSliderLabels($marginSlider, readerSettings.columnGap, readerSettings.columnGap + "px", Strings.i18n_margins);

                if (readerSettings.syntheticSpread == "double"){
                    $('#two-up-option input').prop('checked', true);
                }
                else if (readerSettings.syntheticSpread == "single"){
                    $('#one-up-option input').prop('checked', true);
                }
                else {
                    $('#spread-default-option input').prop('checked', true);
                }
                
                if(readerSettings.scroll == "scroll-doc") {
                    $('#scroll-doc-option input').prop('checked', true);
                }
                else if(readerSettings.scroll == "scroll-continuous") {
                    $('#scroll-continuous-option input').prop('checked', true);
                }
                else {
                    $('#scroll-default-option input').prop('checked', true);
                }
                
                if (readerSettings.pageTransition === 0)
                {
                    $('#pageTransition-1-option input').prop('checked', true);
                }
                else if (readerSettings.pageTransition === 1)
                {
                    $('#pageTransition-2-option input').prop('checked', true);
                }
                else if (readerSettings.pageTransition === 2)
                {
                    $('#pageTransition-3-option input').prop('checked', true);
                }
                else if (readerSettings.pageTransition === 3)
                {
                    $('#pageTransition-4-option input').prop('checked', true);
                }
                else
                {
                    $('#pageTransition-none-option input').prop('checked', true);
                }
                
                if (readerSettings.theme){
                    
                    if(!isTemporaryCustomColorSet()) {
                        setPreviewTheme($previewText, readerSettings);
                        if(readerSettings.themeColor)
                            setCustomThemeColor($("#custom-theme-btn"), readerSettings);
                    }
                }
                
                $previewText.css({fontSize: (readerSettings.fontSize/100) + 'em'});
            });
        });
        
        var save = function(){
            
            var readerSettings = {
                fontSize: Number($fontSizeSlider.val()),
                syntheticSpread: "auto",
                columnGap: Number($marginSlider.val()),
                scroll: "auto"
            };

            if($('#scroll-doc-option input').prop('checked')) {
                readerSettings.scroll = "scroll-doc";
            }
            else if($('#scroll-continuous-option input').prop('checked')) {
                readerSettings.scroll = "scroll-continuous";
            }

            if($('#two-up-option input').prop('checked')) {
                readerSettings.syntheticSpread = "double";
            }
            else if($('#one-up-option input').prop('checked')) {
                readerSettings.syntheticSpread = "single";
            }

            if($('#pageTransition-1-option input').prop('checked')) {
                readerSettings.pageTransition = 0;
            } else if($('#pageTransition-2-option input').prop('checked')) {
                readerSettings.pageTransition = 1;
            } else if($('#pageTransition-3-option input').prop('checked')) {
                readerSettings.pageTransition = 2;
            } else if($('#pageTransition-4-option input').prop('checked')) {
                readerSettings.pageTransition = 3;
            } else {
                readerSettings.pageTransition = -1;
            }
            
            readerSettings.theme = $previewText.attr('data-theme');
            
            if(isCustomTheme(readerSettings.theme)) {
                readerSettings.themeColor = {
                    color: $previewText.css('color'),
                    backgroundColor: $previewText.css('background-color')
                }
            } else {
                readerSettings.themeColor = {
                    color: 'black',
                    backgroundColor: 'white'
                }
            }
            
            
            
            if (reader){
               updateReader(reader, readerSettings);
	        }


            var keys = KeyboardSettings.saveKeys();
            
            Settings.get('reader', function(json)
            {
                if (!json)
                {
                    json = {};
                }
                
                for (prop in readerSettings)
                {
                    if (readerSettings.hasOwnProperty(prop))
                    {
                        json[prop] = readerSettings[prop];
                    }
                }

                json.keyboard = keys;
                // if (keys)
                // {
                //     for (prop in keys)
                //     {
                //         if (keys.hasOwnProperty(prop))
                //         {
                //             json.keyboard[prop] = keys[prop];
                //         }
                //     }
                // }

                Settings.put('reader', json);
                
                setTimeout(function()
                {
                    Keyboard.applySettings(json);
                }, 100);
            });
        };
        
        Keyboard.on(Keyboard.NightTheme, 'settings', function(){

                Settings.get('reader', function(json)
                {
                    if (!json)
                    {
                        json = {};
                    }

                    var isNight = json.theme === "night-theme";
                    json.theme = isNight ? "author-theme" : "night-theme";
                    
                    Settings.put('reader', json);

                    if (reader) updateReader(reader, json);
                });
        });
        
        Keyboard.on(Keyboard.SettingsModalSave, 'settings', function() {
            save();
            $('#settings-dialog').modal('hide');
        });

        Keyboard.on(Keyboard.SettingsModalClose, 'settings', function() {
            $('#settings-dialog').modal('hide');
        });
        
        $('#settings-dialog .btn-primary').on('click', save);

        deleteTemporaryCustomColor();
        initCustomThemeDialog();
	}

	return {
		initDialog : initDialog,
		updateReader : updateReader,
		defaultSettings : defaultSettings
	}
});

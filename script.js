"use strict;"

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Base listeners wrong??
window.addEventListener("load", function(){
    const secondInput = $("#color-background");
    const resultInput = $("#color-result");
    const rgbRadio = $("#rgb-radio");
    const hexRadio = $("#hex-radio");
    const inputWrapper = $("#inputs-wrapper");
    const plusButton = $("#plus-button");
    const minusButton = $("#minus-button");
    const whiteFillIco = $("#white-fill");
    const copyIco = $("#copy");

    let colorInputs = [];

    colorInputs.push(new colorInput(colorInputs.length));

    secondInput.addEventListener("input", inputHandle);
    secondInput.addEventListener("keydown", enterHandle);
    secondInput.addEventListener("click", function(){
        this.select();
    });

    whiteFillIco.addEventListener("click", function(){
        secondInput.value = "#ffffff";
    });
    copyIco.addEventListener("click", function(){
        let text = resultInput.value;
        
        if(text){
            navigator.clipboard.writeText(text);
            notify("Copied", "succ", 1500);

            copyIco.classList.add("disabled");
        }
    });

    plusButton.addEventListener("click", function(){
        colorInputs.push(new colorInput(colorInputs.length));
    });
    minusButton.addEventListener("click", function(){
        colorInputs[colorInputs.length - 1].kill();
        colorInputs.pop();
    });

    myRadio(document.querySelector("#radios"), 0, 200);

    [rgbRadio, hexRadio].forEach(input => {
        input.addEventListener("input", function(){
            if(this.checked){
                resultInput.value = this.dataset.color ?? "";
            }
        });
    });

    function setResult(color){
        rgbRadio.dataset.color = color.rgb;
        hexRadio.dataset.color = color.hex;

        if(rgbRadio.checked){
            resultInput.value = color.rgb;
        } else if(hexRadio.checked){
            resultInput.value = color.hex;
        }

        copyIco.classList.remove("disabled");

        resultInput.parentNode
            .animate(
                [
                    { opacity: 1, transform: "scale(1)" },
                    { opacity: 0.1, transform: "scale(0.85)" },
                    { opacity: 1, transform: "scale(1)" }
                ], 
                { duration: 600, easing: "ease-out" }
            );
    }

    function inputHandle(){
        let firstColors = [];
        let colorInputs = $$(".color-foreground");

        for(let i = 0; i < colorInputs.length; i++){
            let newColor = parseColor(colorInputs[i].value);

            if(!newColor)
                return;

            firstColors.push(newColor);
        }

        let secondaryColor = parseColor(secondInput.value, true);
        
        if(firstColors.length && secondaryColor || firstColors.length > 1){
            let result = mixColors(firstColors, secondaryColor);
            
            if(!result){
                notify("Wrong alphas", "warn");
                return;
            }

            setResult(result);
        }
    }

    function enterHandle(e){
        if(e.key == "Enter"){
            let firstColors = [];
            let colorInputs = $$(".color-foreground");

            for(let i = 0; i < colorInputs.length; i++){
                let newColor = parseColor(colorInputs[i].value);

                if(!newColor){
                    notify("Wrong color format", "warn");
                    return;
                }

                firstColors.push(newColor);
            }

            let secondaryColor = parseColor(secondInput.value, true);
            
            if(firstColors.length && secondaryColor || firstColors.length > 1){
                let result = mixColors(firstColors, secondaryColor);
                
                if(!result){
                    notify("Wrong alphas", "warn");
                    return;
                }

                setResult(result);
            }
        }
    }

    function colorInput(id){
        let thisInput;

        this.create = function(){
            let html = `<label class="input-placeholder input-placeholder-color color-first">
                            <input id=color-${id} class="color-foreground" placeholder="Alpha color" spellcheck="false">
                            <span>Color ${id + 1}</span>
                        </label>`;

            $("#input-buttons").insertAdjacentHTML("beforebegin", html);

            thisInput = $("#color-" + id);

            thisInput.addEventListener("input", inputHandle);

            thisInput.addEventListener("keydown", enterHandle);

            if(colorInputs.length == 1){
                minusButton.style.display = "block";
            }
        }

        this.kill = function(){
            if(colorInputs.length == 2){
                minusButton.style.display = "none";
            }
            
            thisInput.parentNode.remove();
        }

        this.create();
    }

    // Returns object with rgb format & hex format OR false
    function mixColors(firstColors, secondaryColor){
        // Use same separator as user in first input
        const separator = ($("#color-0").value.match(",")) ? ", " : " ";

        let rgb = (secondaryColor) ? "rgb(" : "rgba(";
        let hex = "#";
        let color = [...firstColors[0]];

        // Merge picked colors
        for(let i = 0; i < firstColors.length; i++){
            if(i + 1 == firstColors.length)
                break;

            let nextAlpha = firstColors[i + 1][3] + color[3] * (1 - firstColors[i + 1][3]);

            for(let j = 0; j < 3; j++){
                let newColor = ((firstColors[i + 1][j] * firstColors[i + 1][3]) + (color[j] * color[3] * (1 - firstColors[i + 1][3]))) /  nextAlpha
                color[j] = newColor;
            }

            color[3] = nextAlpha;
        }

        // Merge with background color
        for(let i = 0; i < 3; i++){
            let fullColor;

            if(secondaryColor){
                fullColor = Math.round(color[i] * color[3] + secondaryColor[i] * (1) * (1 - color[3]) / (color[3] + (1) * (1 - color[3])));
            } else {
                fullColor = color[i];
            }

            if(fullColor > 255 || fullColor < 0)
                return false;

            rgb += fullColor + ((i != 2) ? separator : "");
            hex += fullColor.toString(16).padStart(2, "0");
            
            if(i == 2){
                if(secondaryColor){
                    rgb += ")";
                } else {
                    // Show alpha if background color not defined
                    rgb += separator + (color[3]) + ")";
                    hex += Math.round(color[3] * 255).toString(16);
                }
            }
        }

        return {
            rgb: rgb,
            hex: hex
        };
    }

    // If ignoreAlpha false and alpha is missing throw error
    // Returns array OR false
    function parseColor(color, ignoreAlpha = false){
        let colors = [];
        let alpha;

        if(color.match("#")){
            // Hex
            color = color.trim();

            if(color.length == 4 || color.length == 5){
                // Formats #ffff #fff
                for(let i = 1; i < color.length; i++){
                    let val = parseInt(color[i], 16) * 16  + parseInt(color[i], 16);

                    if(isNaN(val) || val < 0 || val > 255)
                        return false;

                    colors.push(val);
                }

                alpha = colors[3] / 255;
                colors.length = 3;
            } else if(color.length == 7 || color.length == 9){
                // Formats #ffffffff #ffffff
                for(let i = 1; i < color.length - 1; i = i + 2){
                    let val = parseInt(color[i], 16) * 16 + parseInt(color[i + 1], 16);

                    if(isNaN(val) || val < 0 || val > 255)
                        return false;

                    colors.push(val);
                }

                alpha = colors[3] / 255;
                colors.length = 3;
            } else {
                return false;
            }
        } else {
            // Rgb
            if(color.match("/")){
                // Formats: rgba(0 0 0 / 0.8) rgba(0 0 0 / 80%) rgb(0 0 0)
                if(!ignoreAlpha){
                    let temp = color.match(/\/(.+)/);

                    if(!temp)
                        return false;

                    alpha = parseFloat(temp[1].replace(/[^0-9.]/g, ""));

                    if(color.match("%")){
                        alpha = alpha / 100;
                    }
                }

                let temp = color.replace(/\/.+/, "").split(" ");

                for(let i = 0; i < 3; i++){
                    colors[i] = parseInt(temp[i].replace(/\D/g, ""));

                    if(isNaN(colors[i]) || colors[i] < 0 || colors[i] > 255)
                        return false;
                }
            } else {
                // Formats: rgba(0,0,0,0.8) rgb(0,0,0) 
                let temp = color.replace(/\s/g, "").match(/\((\d+),(\d+),(\d+),([0-9.]{1,})|(\d+),(\d+),(\d+)/);

                if(!temp)
                    return false;

                temp = temp.filter(m => m !== undefined);

                if(!ignoreAlpha){
                    if(!temp[4])
                        return false;

                    alpha = temp[4].replace(/[^0-9.]/g, "");
                }
                
                for(let i = 0; i < 3; i++){
                    colors[i] = parseInt(temp[i + 1].replace(/\D/g, ""));

                    if(isNaN(colors[i]) || colors[i] < 0 || colors[i] > 255)
                        return false;   
                }
            }
        }

        if(!ignoreAlpha && (isNaN(alpha) || alpha > 1 || alpha < 0))
            return false;
            
        if(!ignoreAlpha){
            colors.push(parseFloat(alpha));
        }

        return colors;
    }

    function myRadio(wrapper, startIndex = -1, shiftTime = 250){
        let timeout;
        let line = wrapper.querySelector(".radio-line");
        line.style.transition = shiftTime + "ms";

        // Must be mousedown to get :checked element before its changed
        wrapper.addEventListener("mousedown", function(e){
            let clickedEl = e.target.closest("label");
            
            if(clickedEl){
                if(line.style.width == "0" || line.style.width == ""){
                    // First click
                    let thisWidth = clickedEl.offsetWidth;
                    let thisLeft = clickedEl.offsetLeft;

                    line.style.left = thisLeft + "px";
                    line.style.width = thisWidth + "px";
                } else {
                    let lastIndex = Array.from(wrapper.children).indexOf(wrapper.querySelector(":checked").parentNode);
                    let newIndex = Array.from(wrapper.children).indexOf(clickedEl);

                    if(newIndex == lastIndex)
                        return;

                    clearTimeout(timeout);

                    if(newIndex > lastIndex){
                        // Left to right
                        let fullWidth = clickedEl.offsetLeft - line.offsetLeft + clickedEl.offsetWidth;

                        line.style.left = line.offsetLeft + "px";
                        line.style.right = "auto";
                        line.style.width = fullWidth + "px";

                        timeout = setTimeout(function(){
                            line.style.width = clickedEl.offsetWidth + "px";
                            line.style.left = clickedEl.offsetLeft + "px"
                        }, shiftTime);
                    } else {
                        // Right to left
                        let lineOffsetRight = line.offsetLeft + line.offsetWidth
                        let rightPos = clickedEl.parentNode.offsetWidth - lineOffsetRight;
                        let fullWidth = lineOffsetRight - clickedEl.offsetLeft;

                        line.style.right = (rightPos) + "px";
                        line.style.left = "auto";
                        line.style.width = fullWidth + "px";

                        timeout = setTimeout(function(){
                            line.style.width = clickedEl.offsetWidth + "px";
                            line.style.right = (clickedEl.parentNode.offsetWidth - (clickedEl.offsetLeft + clickedEl.offsetWidth)) + "px"
                        }, shiftTime);
                    }
                }
            }
        });

        // Start on position if startIndex defined
        if(startIndex > -1){
            let e = new Event("mousedown", {bubbles: true});
            let el = wrapper.querySelector("label:nth-of-type(" + (startIndex + 1) + ")");

            el.dispatchEvent(e);
            el.querySelector("input").checked = true;
        }
    }

    function notify(text, type = "", delay = 4000){
        // Example:
        //          notify("", "load");
        //          notify("Deleted", "succ");
        // Types:   warn. succ, load

        const $ = document.querySelectorAll.bind(document);

        let ico = "";
        let headerText = "Notify";

        switch(type){
            case "warn":
                ico = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/></svg>';
                headerText = "Warning";
                break;
            case "succ":
                ico = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                headerText = "Success";
                break;
            case "info":
                ico = '<svg viewBox="1 1 22 22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></svg>';
                headerText = "Info";
                break;
            case "":
                delay = 0;
                break;
        }

        let notify;
        
        if(!$("#z-notify").length){
            let notifyHtml = "<div id=z-notify data-index=0 class='notify-" + type + "'><div class=notify-header><span class='notify-icons'>" + ico + "</span><span class=header-text>" + headerText + "</span></div><div class=notify-text>" + text + "</div></div>";
            $("html")[0].insertAdjacentHTML('beforeend', notifyHtml);
            notify = $("#z-notify")[0];

            notify.addEventListener("click", function(){
                this.classList.remove("notify-visible");
            });
        } else {
            notify = $("#z-notify")[0];
            notify.querySelector(".header-text").textContent = headerText;
            notify.querySelector(".notify-icons").innerHTML = ico;
            notify.querySelector(".notify-text").innerHTML = text;
            notify.dataset.index++;
        }

        let thisIndex = notify.dataset.index;

        notify.style.transition = "all 0s";
        notify.classList.remove("notify-visible");
        notify.clientWidth;
        notify.style.removeProperty("transition");

        notify.setAttribute("class", "notify-visible notify-" + type);

        if(type != "load" && delay != 0){
            setTimeout(function(){
                if(notify.dataset.index == thisIndex)
                    notify.classList.remove("notify-visible");
            }, delay);
        }
    }
});
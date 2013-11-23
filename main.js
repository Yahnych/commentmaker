(function () {
  "use strict";
  //Define the variables
  var templateText, templateTextArea, scrollHeight, inputsDiv,
    keysInTemplate, template, makeStoryButton, newStory,
    updateTemplateButton, randomRadios, keyInputs,
    optionInput, optionNumberInput, genderSelector, gender,
    keyIntructions, maximumNumberOfOptions, storyOptionSelector,
    storyOptionsDiv, personalComment,
    optionSelected = 1,
    keyObject = {};

  //HTML elements
  templateTextArea = document.querySelector("#template");
  inputsDiv = document.querySelector("#inputs");
  storyOptionsDiv = document.querySelector("#storyOptionsDiv");
  makeStoryButton = document.querySelector("#makeStoryButton");
  newStory = document.querySelector("#newStory");
  updateTemplateButton = document.querySelector("#updateTemplateButton");
  randomRadios = document.querySelectorAll("[name=random]");
  randomRadios = Array.prototype.slice.call(randomRadios);
  optionInput = document.querySelector("#optionInput");
  storyOptionSelector = document.querySelector("#storyOptionSelector");
  genderSelector = document.querySelector("#gender");
  keyIntructions = document.querySelector("#keyIntructions");
  personalComment = document.querySelector("#personalComment");

  //Initilize the template
  templateText = "[name] wrote [an excellent, a good, a fair] essay on [topic]. Her writing skills [are well-developed and, are developing and, need practice but] she wrote [a highly imaginative, thoughtful, acceptable] children's storybook. She has [an excellent, a very good, a reasonable] understanding of basic grammar, as exhibited by her quiz. [name] [produced work of a high standard and she has shown an impressive commitment in class, produced good quality work this term and [name]'s skills will continue to improve with practice, shows an ability in English but should remember to maintain focus when in class].";
  //store.clear()
  loadTemplate();

  function loadTemplate() {
    //Load the template from local storage if it exists
    var storedTemplate = store.get("template");
    if (storedTemplate !== undefined) {
      if (storedTemplate.name !== undefined) {
        //Retrieve the template and turn <br> line breaks back
        //into newline characters: \n
        template = storedTemplate.name.replace(/<br\s*\/?>/mg, "\n");
      } else {
        template = templateText;
      }
    } else {
      template = templateText;
    }
    templateTextArea.value = template;
    resize(templateTextArea);
  }

  //Update the textarea scroll height
  templateTextArea.addEventListener('keydown', resizeTextarea);
  function resizeTextarea(event) {
    resize(event.target);
  }
  //Set the template height to the right size for the content
  function resize(textarea) {
    textarea.style.height = '24px';
    textarea.style.height = textarea.scrollHeight + 12 + 'px';
  }
  
  //Find the keys in the template and display them as
  //input text field elements
  findKeysInTemplate();

  function findKeysInTemplate() {
    var input, span, p;
    keysInTemplate = story.findKeysInTemplate(template);
    if (keysInTemplate !== null) {
      keyIntructions.style.display = "block";
      inputsDiv.style.display = "block";
      keysInTemplate.forEach(function (key) {
        p = document.createElement("p");
        inputsDiv.appendChild(p);
        span = document.createElement("span");
        span.innerHTML = key;
        span.setAttribute("class", "label");
        p.appendChild(span);
        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Enter something...");
        p.appendChild(input);
      });
      //Get a reference to the key input text fields that were
      //created in the code above
      keyInputs = document.querySelectorAll("input[type=text]");
      keyInputs = Array.prototype.slice.call(keyInputs);
    } else {
      keyIntructions.style.display = "none";
      inputsDiv.style.display = "none";
    }
  }

  //Find the maximum number of story options in the template
  findMaximumOptions();

  function findMaximumOptions() {
    maximumNumberOfOptions = story.getMaximumNumberOfOptions(template);
    console.log(maximumNumberOfOptions);
    if (maximumNumberOfOptions !== undefined) {
      //var el = document.createElement("option");
      //storyOptionSelector.appendChild(el);
      for (var i = 1; i <= maximumNumberOfOptions; i++) {
        var el = document.createElement("option");
        el.textContent = i;
        el.value = i;
        storyOptionSelector.appendChild(el);
      }
      storyOptionsDiv.style.display = "block";
    } else {
      storyOptionsDiv.style.display = "none";
    }
  }

  //The "Make Story" button
  makeStoryButton.addEventListener("mousedown", makeStoryHandler, false);

  function makeStoryHandler() {
    if (templateTextArea.value !== "" || templateTextArea.value !== undefined) {
      //Get the keys from the key text input boxes
      if (keysInTemplate !== null) {
        keysInTemplate.forEach(function (key, index) {
          keyObject[key] = keyInputs[index].value;
        });
      }
      //Set the gender for pronouns, if it's been defined
      gender = genderSelector.options[genderSelector.selectedIndex].value;
      if (gender === "none") {
        gender = undefined;
      }
      //Get the text from the template textarea and assign it
      //to the template variable
      template = templateTextArea.value;
      //Preserve line breaks from the textarea. This converts 
      //Text line break characters to <br>
      template = template.replace(/\n\r?/g, '<br>');
      //store the template in local storage
      //store.set("template", template);
      store.set("template", {
        name: template
      });
      console.log("optionSelected: " + optionSelected);
      //Make a new story and assign it to the innerHTML of
      //the <p> tag on the right side of the screen
      newStory.innerHTML = story.make({
        template: template,
        keys: keyObject,
        optionNumber: optionSelected,
        gender: gender
      });
      //Add the personal comment
      newStory.innerHTML += " " + personalComment.value;
    }
  }

  //The "Update Template" button
  updateTemplateButton.addEventListener("mousedown", updateTemplateHandler, false);

  function updateTemplateHandler() {
    //Remove an previous story key inputs that might 
    //have been displayed
    while (inputsDiv.firstChild) {
      inputsDiv.removeChild(inputsDiv.firstChild);
    }
    //Remove an previous story option numbers that might 
    //have been displayed
    while (storyOptionSelector.firstChild) {
      storyOptionSelector.removeChild(storyOptionSelector.firstChild);
    }
    //Assign the template textarea to the template variable
    template = templateTextArea.value;
    //scrollHeight = templateTextArea.scrollHeight;
    //templateTextArea.style.height = scrollHeight + "px";
    //Find the new keys in the updated template
    findKeysInTemplate();
    findMaximumOptions();
  }

  //Random option radio buttons
  randomRadios.forEach(function (radio) {
    radio.addEventListener("change", randomRadiosHandler, false);
  });

  function randomRadiosHandler(event) {
    if (event.target.value === "off") {
      //optionInput.style.display = "block";
      optionSelected = optionNumberInput.value;
    } else {
      //optionInput.style.display = "none";
      optionSelected = undefined;
    }
  }

  //Number option input
  storyOptionSelector.addEventListener("change", optionSelectedHandler, false);
  function optionSelectedHandler() {
    optionSelected = storyOptionSelector.value;
  }
}());
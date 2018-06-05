var creationForm;
var finalContentArea;

function emailHead(introParagraph){
  /* Beginning to email. Interpolates introParagraph in the correct place */
  html = `<table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 600px; overflow: hidden; box-sizing: border-box; font-family: 'Times';">
  	<tbody>
      <tr>
        <td style="border-bottom: 3px solid #ddd; padding: 20px;">
          <p>
            Hey [person_first_name]!
          </p>
          <p>
            ${introParagraph}
          </p>
        </td>
      </tr>
  `
  return html;
}

// End to email template
const EMAIL_FOOTER = `
<tr>
  <td style="padding: 20px 0;">
    <a href="https://internationalstudiesabroad.simplybook.me/sheduler/manage/event/29" style="display: block; border: 1px solid #ddd; padding: 20px; text-align: center; font-family: 'Helvetica', sans-serif; font-size: 24px; color: white; background: rgb(0,37,61); text-decoration: none;">
      Book a Free Advising Session
    </a>
  </td>
</tr>
</tbody>
</table>

`

function createHTMLElement(tag, params) {
  /* Helper function to easily create an HTML element.

  Parameters:
    tag (String): the type of HTML element to be greated.
    params (JSON): object containing all HTML attributes for the HTML element.
  */
  var el = document.createElement(tag);
  if (!params) {
    return el;
  }
  var keys = Object.keys(params);
  for (let i=0; i < keys.length; i++) {
    // iterate through keys in the params object, assiging the HTML
    // corresponding attribute to its value.
    if (keys[i] === 'klass') {
      // Add to classlist instead of completely hard-setting it
      el.classList.add(params[keys[i]]);
    } else if (keys[i] == 'textContent') {
      // because textContent is a JS property and not an HTML attr, it must be
      // set differently
      el.textContent = params[keys[i]];
    } else {
      el.setAttribute(keys[i], params[keys[i]]);
    }
  }
  return el;
}

function addLineBreaks(text) {
  /* Add line breaks to the value of a textarea.*/
  return text.replace(/\r?\n/g, '<br />');
}

function HTMLInput(type, title, sectionName, placeholder, value) {
  /* Object that contains all necessary data to create, render, and get data
  from an HTML Input element.

  Attributes:
    this.name (String): the value to be used as the name on the input
      element and the for attr on its corresponding label. Taken from
      sectionName parameter.
    this.label (HTML Node): the HTML label element for the input.

  */
  this.name = sectionName + title.toLowerCase();
  this.label = createHTMLElement('label', {'for': this.name, 'textContent': title});
  var params = {}
  if (name)
    params['name'] = name;
  if (placeholder)
    params['placeholder'] = placeholder;
  if (value)
    params['value'] = value;

  if (type === 'button') {
    params['value'] = title;
  }
  if (type !== 'textarea') {
    // if not creating a textarea element, the HTML element will be an Input
    // with a specific type. The type is set here.
    params['type'] = type;
    type = 'input';
  }

  this.input = createHTMLElement(type, params);
  this.value = function() {
    return this.input.value;
  }
}

function Section(index) {
  /* Individual section of a CreationForm.

  These sections contain all necessary html and meta data to create, render, and
  draw information from the html inputs required to make an individual section
  of the email.

  Attributes:
    this.num (int): section number (1-index)
    this.sectionname (string): the name of the section to be used in classes and
      names of individual elements.
    this.html (HTML Node): the HTML Node containing the form section.
    this.urlInput (HTMLInput): HTML Input element for adding the external link
    this.typeInput (HTMLInput): HTML Input element for adding the type of
      content contained in the section (ie. 'Program Highlight')
    this.titleInput (HTMLInput): HTML Input element for adding the title of the
      section
    this.imageInput (HTMLInput): HTML Input element for adding the url to the
      image to be displayed in the section
    this.blurbInput (HTMLInput): HTML textarea element for adding the blurb to
      the section
    this.deleteBtn (opt: HTMLInput): HTML input[type=button] element for
      deleting the section. This is only added to sections after the first.


  */
  this.num = index;
  this.sectionName = 'section' + this.num + '_';
  this.html = createHTMLElement('fieldset', {klass:'email-section'});

  // create fieldset legend
  this.html.append(createHTMLElement('legend', {'textContent':'Section ' + this.num}));

  this.urlInput = new HTMLInput('text', 'Link URL', this.sectionName, 'link to content (ie. blog post, etc)');
  this.html.append(this.urlInput.label);
  this.html.append(this.urlInput.input);

  this.typeInput = new HTMLInput('text', 'Type', this.sectionName, "type of section (ie. 'Program Highlight')");
  this.html.append(this.typeInput.label);
  this.html.append(this.typeInput.input);

  this.titleInput = new HTMLInput('text', 'Title', this.sectionName, "title of section");
  this.html.append(this.titleInput.label);
  this.html.append(this.titleInput.input);

  this.imageInput = new HTMLInput('text', 'Image URL', this.sectionName, "url of image on ISA database (use HTML email editor)");
  this.html.append(this.imageInput.label);
  this.html.append(this.imageInput.input);

  this.blurbInput = new HTMLInput('textarea', 'Blurb', this.sectionName, "preview of what the user will see");
  this.html.append(this.blurbInput.label);
  this.html.append(this.blurbInput.input);

  if (this.num !== 1) {
    this.deleteBtn = new HTMLInput('button', 'Delete Section', this.sectionName);
    this.html.append(this.deleteBtn.input);
  }

  this.render = function() {
    /* Return template string used to render the html of the section. Contains
    all values inputted by the user.
    */
    return `
    <tr>
      <td style="border-bottom: 3px solid #ddd;">
        <a alt="" href="${this.urlInput.value()}" title="" style="color: inherit; text-decoration: none;" target="_blank">
          <div style="margin: 20px; width: 80%;">
            <h1 style="font-family: 'Helvetica', sans-serif; font-weight: normal; font-size: 16px; margin: 0; color: #888;">
              ${this.typeInput.value()}
            </h1>
            <h2 style="font-family: 'Helvetica', sans-serif; font-weight: normal; font-size: 24px; margin: 0; margin-top: 5px; color: #333;">
              ${this.titleInput.value()}
            </h2>
          </div>
        <img alt="" src="${this.imageInput.value()}" style="max-width: 100%;  text-align: center; margin-left: auto; margin-right: auto;" />
        <p style="padding: 20px;">
          ${addLineBreaks(this.blurbInput.value())}
        </p>

          <p style="padding-left: 20px; padding-bottom: 20px; color: blue;">More &rarr;</p>
        </a>
      </td>
    </tr>
    `
  }
}

function CreationForm(html) {
  /* Form used to create the HTML email

  Attributes:
    this.html (HTML Node): The form container.
    this.addSectionBtn (HTML Node): The HTML button element used to add another
      section to the form.
    this.introParagraph(HTML Node): the HTML textarea element used to insert an
      introduction to the email.
    this.section (listof Section): list of Sections to be edited and rendered.

  */
  this.html = html;
  this.addSectionBtn = this.html.querySelector('#addSectionBtn');
  this.introParagraph = this.html.querySelector('#intro');
  this.sections = [];

  this.addSectionBtn.addEventListener('click', (e) => {
    /* Event listener to add another section to the email editor and email template.*/
    e.preventDefault();
    this.addSection();
  });

  this.addSection = function() {
    /* Add another section to the email editor and email template.*/
    var section = new Section(this.sections.length + 1);

    this.sections.push(section);
    this.html.insertBefore(section.html, this.addSectionBtn);

    if (section.deleteBtn) { // If there's a delete button, add a listener to it
      section.deleteBtn.input.addEventListener('click', (e) => {
        this.deleteSection(section.num - 1);
      });
    }
  }

  this.deleteSection = function(index) {
    /* Delete the section with given index from this.sections, remove html */
    this.html.removeChild(this.sections[index].html);
    delete this.sections[index];
  }

  this.render = function() {
    /* Render html for email template. Uses emailHead and EMAIL_FOOTER with
    each section in this.sections in between. */
    var html = emailHead(addLineBreaks(this.introParagraph.value));
    for (let i=0; i < this.sections.length; i++) {
      if (this.sections[i])
        html += this.sections[i].render();
    }
    html += EMAIL_FOOTER;
    return html;
    this.finalContentTarget.value = emailTemplate;
  }

}

function FinalContentArea(html, form) {
  /* The area to display the finished product.

  This object is a container which contains buttons for generating both a
  preview and the code directly, as well as containers to display the results of
  each button.

  Attributes:
    this.html (HTML Node): the html containing all components for the object.
    this.previewCtn (HTML Node): the HTML node containing the preview container.
      This wraps both the preview area and the code copy area.
    this.previewBtn (HTML Node): The HTML button which displays the preview.
    this.previewArea (HTML Node): The HTML node where the preview will be
      attached.
    this.codeBtn (HTML Node): The HTML button which displays the raw code for
      copying.
    this.codeArea (HTML Node): The HTML textarea element where the raw code for
      the email will be attached.
    this.form (CreationForm): The form which contains the information for the
      email template.
  */
  this.html = html;
  this.previewCtn = this.html.querySelector('.final-content__preview-ctn');
  this.previewBtn = this.html.querySelector('.final-content__preview-btn');
  this.previewArea = this.html.querySelector('.final-content__preview-area');
  this.codeBtn = this.html.querySelector('.final-content__code-btn');
  this.codeArea = this.html.querySelector('.final-content__code-area');

  this.form = form;

  this.previewBtn.addEventListener('click', (e) => {
    /* Listener to trigger preview display */
    e.preventDefault();
    this.generatePreview();
  });

  this.generatePreview = function () {
    /* Hides the code copy interface, renders the email in rich HTML on-screen.
    */
    this.previewBtn.classList.add('active');
    this.codeBtn.classList.remove('active');
    this.codeArea.classList.add('hide');
    this.previewArea.innerHTML = this.form.render();
    this.previewArea.classList.remove('hide');
    this.showPreview();
  }

  this.codeBtn.addEventListener('click', (e) => {
    /* Listener to trigger code copying interface */
    e.preventDefault();
    this.generateRawCode();
  });

  this.generateRawCode = function () {
    /* Hides the rich preview interface, render the email template in raw HTML
    code for copyin. */
    this.codeBtn.classList.add('active');
    this.previewBtn.classList.remove('active');
    this.previewArea.classList.add('hide');
    this.codeArea.value = this.form.render();
    this.codeArea.classList.remove('hide');
    this.showPreview();
  }

  this.showPreview = function () {
    /* this.previewCtn should be hidden when the page first loads. This method
    un-hides it. */
    if (this.previewCtn.classList.contains('hide')) {
      this.previewCtn.classList.remove('hide');
    }
  }
}


document.addEventListener('DOMContentLoaded', function(e) {
  creationForm = document.getElementById('creationForm');
  creationForm = new CreationForm(creationForm);
  creationForm.addSection();
  finalContentArea = document.getElementById('finalContentArea');
  finalContentArea = FinalContentArea(finalContentArea, creationForm);
});

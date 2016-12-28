var validationMessages = {
    en: {
        email: 'Value is not valid email address.',
        required: 'Value is required.',
        number: 'Value is not a number.'
    },
    fi: {
        email: 'Kelvoton sähköpostiosoite.',
        required: 'Tämä puuttuu.',
        number: 'Kelvoton numero.'
    }
}

class ValidationRules {
    // validation rule should return true if valid

    required(value) {
        return value.length > 0
    }

    email(value) {
        let pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        return pattern.test(value)
    }

    number(value) {
        let pattern = /^(\d+(?:[\.\,]\d+)?)$/
        return pattern.test(value)
    }
}

class Form {
    constructor(settings) {
        this.formId = settings.id
        this.validations = settings.validations
        this.errorMsgClass = '.' + settings.config.errorMsgClass
        this.hide = settings.hide

        this.validationRules = new ValidationRules

        this.validationMessages = validationMessages
        this.language = (settings.config.hasOwnProperty('language')) ? settings.config.language : 'en'

        this.form = document.getElementById(this.formId)
        this.elements = document.getElementById(this.formId).elements

        this.fields = {}
        this.setFields()
        this.listenForKeys()
        this.toggleFields()

    }

    setFields() {
        for (let el of this.elements) {
            if (el.name != '') this.fields[el.name] = el.value
        }
    }

    toggleFields() {
        for (let cField in this.hide) {
            let parent = this.elements[cField].parentElement

            for (let formField in this.fields) {
                if (this.hide[cField].hasOwnProperty(formField) ) {
                    if (this.hide[cField][formField].indexOf('empty') > -1 && this.fields[formField].length < 1) {
                        parent.style.display = 'none'
                    } else {
                        parent.style.display = 'block'
                    }
                }
            }

        }
    }

    listenForKeys() {
        for (let el of this.elements) {
            let parent = el.parentElement
            el.addEventListener('keyup', () => {
                this.fields[el.name] = el.value
                if (parent.classList.contains('has-danger')) {
                    parent.classList.remove('has-danger')
                    parent.querySelector(this.errorMsgClass).style.display = 'none'
                }
            })
            el.addEventListener('blur', () => {
                this.fields[el.name] = el.value
                this.validate(el.name, el.value)
                this.toggleFields()
            })
        }
    }

    validate(field, value) {
        if (this.validations.hasOwnProperty(field)) {
            for (let rule in this.validations[field]) {
                this.isValid(this.validations[field][rule], field, value)
            }
        }
    }

    submit(event) {
        event.preventDefault()
        console.log(event)
        // this.form.submit(false)
    }

    isValid(rule, field, value) {
        let parent = this.elements[field].parentElement
        if (!this.validationRules[rule](value)) {
            parent.classList.add('has-danger')
            let errorMsg = parent.querySelector(this.errorMsgClass)
            errorMsg.style.display = 'block'
            errorMsg.innerHTML = this.validationMessages[this.language][rule]
            this.elements[field].parentElement.classList.add('has-danger')
        }
    }
}

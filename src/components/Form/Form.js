import React, { PureComponent } from 'react';

export default class MyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      status: ''
    };
  }

  submitForm(ev) {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        this.setState({ status: 'SUCCESS' });
      } else {
        this.setState({ status: 'ERROR' });
      }
    };
    xhr.send(data);
  }

  render() {
    const { status } = this.state;
    return (
      <form
        onSubmit={this.submitForm}
        action="https://admin.nikkras.com/wp-json/contact-form-7/v1/contact-forms/19/feedback"
        method="POST"
      >
        <label>Name:</label>
        <input type="text" name="your-name" />
        <label>Email:</label>
        <input type="email" name="your-email" />
        <label>Subject:</label>
        <input type="text" name=" your-subject" />
        <label>Message:</label>
        <textarea type="text" name="your-message" />
        {status === 'SUCCESS' ? <p>Thanks!</p> : <button>Submit</button>}
        {status === 'ERROR' && <p>Ooops! There was an error.</p>}
      </form>
    );
  }
}

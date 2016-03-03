import React from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import $ from 'jquery'

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []}
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  componentDidMount: function() {
    this.loadCommentsFromServer()
  },
  render: function() {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });
  }
})

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    })
    return (
      <div className='commentList'>
        {commentNodes}
      </div>
    )
  }
})

var Comment = React.createClass({
  raw_markup: function() {
    var raw_markup = marked(this.props.children.toString(), {sanitize: true})
    return { __html: raw_markup }
  },

  render: function() {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          {this.props.author}
        </div>
        <div className='panel-body'>
          <span dangerouslySetInnerHTML={this.raw_markup()} />
        </div>
      </div>
    )
  }
})

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if (!text || !author) {
      return
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''})
  },
  render: function() {
    return (
      <div className='row'>
        <div className='col-md-6 col-md-push-3'>
          <form className='commentForm' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <input
                  type='text'
                  className='form-control'
                  placeholder='Your name'
                  value={this.state.author}
                  onChange={this.handleAuthorChange}
              />
            </div>
            <div className='form-group'>
              <input
                  type='text'
                  className='form-control'
                  placeholder='Say something...'
                  value={this.state.text}
                  onChange={this.handleTextChange}
              />
            </div>
            <input type='submit' className='btn btn-default' value='Post' />
          </form>
        </div>
      </div>
    )
  }
})

var server_url = $('#data').data('url')

ReactDOM.render(
  <CommentBox url={server_url + '/comments'} />,
  document.getElementById('content')
)

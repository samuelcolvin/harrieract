import React from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import $ from 'jquery'

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []}
  },
  componentDidMount: function() {
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
  render: function() {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    )
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
  render: function() {
    return (
      <div className='commentForm'>
        Hello, world! I am a CommentForm.
      </div>
    )
  }
})

var server_url = $('#data').data('url')

ReactDOM.render(
  <CommentBox url={server_url + '/comments'} />,
  document.getElementById('content')
)

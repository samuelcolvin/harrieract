import React from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'

var data = [
  {id: 1, author: 'Pete Hunt', text: 'This is one comment'},
  {id: 2, author: 'Jordan Walker', text: 'This is **another** comment'}
]

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.props.data}/>
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

ReactDOM.render(
  <CommentBox data={data} />,
  document.getElementById('content')
)

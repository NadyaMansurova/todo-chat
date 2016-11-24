import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import moment from 'moment';

export default class Post extends Component {

  componentDidMount() {
		const { lastNode } = this.props;
    const node = ReactDOM.findDOMNode(this.refs['_div_' + lastNode]);
    if (node) {
      node.scrollIntoView();
    }
  }

  componentDidUpdate() {
		  const { lastNode } = this.props;
      const node = ReactDOM.findDOMNode(this.refs['_div_' + lastNode]);
      if (node) {
        node.scrollIntoView();
      }
  }

  render() {
		const { lastNode, number, counter, edge, avatar, editPost, deletePost } = this.props;
		const time = moment(edge.node.data).format('DD.MM.YYYY hh:mm:ss');
		const url = "/img/" + avatar;

    return (
      <li className="message" ref={'_div_' + number}>
				<div  className="post__container">
					<div className="post__avatar">
						<img  className="post__image" src={url} width="25" height="25"/>
					</div>
					<div className="post__content">
						<div className="post__text">{edge.node.text}</div>
						<div className="btn__group">
							<a href="#" className="btn btn__edit" onClick={editPost}>
								<i className="fa fa-pencil" aria-hidden="true"></i>
							</a>
							<a href="#" className="btn btn__delete" onClick={deletePost}>
								<i className="fa fa-remove" aria-hidden="true"></i>
							</a>
						</div>
					</div>
				</div>
				<div className="post__time">{time}</div>
			</li>
    );
  }
}

var Y = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});

React.render(<Y name="John" />, document.getElementById('node2'));
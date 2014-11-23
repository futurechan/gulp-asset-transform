
var X = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});

React.render(<X name="Jane" />, document.getElementById('node1'));

import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {connect} from 'react-redux';
import * as type from '../../redux/actionTypes';

class TyreEdit extends React.Component {

    state = {
        tyre: {
            name: '',
            description: ''
        },
        updated: false
    }

    handleChange = (key, value) => {
        const tyre = { ...this.state.tyre };
        tyre[key] = value;
        this.setState({
            tyre
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/tyres/${this.props.match.params.id}`, this.state.tyre)
            .then(response => {
                let tyre = response.data;
                this.setState(tyre);
            });
        this.props.updateCounter();
    }

    componentDidMount () {
        axios.get(`/api/tyres/${this.props.match.params.id}`)
            .then(response => {
                let tyre = response.data;
                this.setState({ tyre });
            })

            .catch(error => {
                this.setState({ error: true });
            });
    }

    render () {

        const options = this.props.brands.map(brand =>
            <option value={brand.id} key={brand.id}>{brand.name}</option>
        )

        return (
            <div className="tyre-edit">
            <Helmet>
                <title>Modifier un pneu</title>
            </Helmet>
                {this.state.updated ?
                    'Mise à jour réussi'
                    : null
                }
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <label htmlFor="name">Nom</label>
                        <input type="text" id="name" value={this.state.tyre.name} onChange={(e) => this.handleChange('name', e.target.value)} />
                    </p>
                    <p>
                        <label htmlFor="brand">Marque</label>
                        <select id="brand" value={this.state.tyre.brandId} onChange={(e) => this.handleChange('brandId', e.target.value)}>
                            <option />
                            {options}
                        </select>
                    </p>
                    <p>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="6" cols="40" onChange={(e) => this.handleChange('description', e.target.value)} value={this.state.tyre.description} />
                    </p>
                    <div>
                        <h2>Preview</h2>
                        <div dangerouslySetInnerHTML={{ __html: this.state.tyre.description }}></div>
                    </div>
                    <button type="submit">Envoyer</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        brands: state.brands
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateCounter: () => dispatch({type: type.UPDATE_COUNTER}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TyreEdit));

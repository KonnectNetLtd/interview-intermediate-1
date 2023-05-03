import React, { Component } from 'react';

export class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingCount: 0,
            data: []
        };
    }

    componentDidMount() {
        this.fetchReport();
    }

    async fetchReport() {
        this.setState({ loadingCount: this.state.loadingCount+1 });
        const response = await fetch('race/reports');
        const data = await response.json();
        this.setState({ data: data, loadingCount: this.state.loadingCount-1 });
    }
    
    render() {
        const data = this.state.data;
        const properties = Object.getOwnPropertyNames(data[0] ?? {});
        
        return (
            <div className='row'>
                <div className='col-12 mb-4'>
                    <div className='bg-white p-3'>
                        {
                            properties.length === 0 
                                ? (<div className='fst-italic text-muted text-center'>No data</div>) 
                                : (
                                    <table className={'table'}>
                                        <thead>
                                            <tr>{properties.map(p => (<th key={p}>{p}</th>))}</tr>
                                        </thead>
                                        <tbody>
                                            {this.state.data.map((d, i) => (<tr key={i}>{properties.map(p => (<td key={`${i}_${p}`}>{d[p]}</td>))}</tr>))}
                                        </tbody>
                                    </table>
                                )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

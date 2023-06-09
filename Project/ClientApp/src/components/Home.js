import React, { Component } from 'react';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingCount: 0,
            teams: [],
            drivers: [],
            lapTimes: {},
            selectedTeam: undefined,
        };
    }

    componentDidMount() {
        this.fetchTeams();
    }

    async fetchTeams() {
        this.setState({ loadingCount: this.state.loadingCount+1 });
        const response = await fetch('personnel/teams');
        const teams = await response.json();
        this.setState({ teams: teams, loadingCount: this.state.loadingCount-1 });
    }
    
    async fetchDrivers(teamId) {
        this.setState({ loadingCount: this.state.loadingCount+1 });
        const response = await fetch(`personnel/teams/${teamId}/drivers`);
        const drivers = await response.json();
        this.setState({ drivers: drivers, loadingCount: this.state.loadingCount-1 }, () => {
            this.setState({ loadingCount: this.state.loadingCount+1 });
            const fetchTimesPromises = [];
            this.state.drivers.forEach(d => fetchTimesPromises.push(this.fetchTimes(d.id)));
            Promise.all(fetchTimesPromises)
                .then(() => this.setState({ loadingCount: this.state.loadingCount-1 }));
        });
    }
    
    async fetchTimes(driverId) {
        const response = await fetch(`race/drivers/${driverId}/times`);
        const lapTimes = await response.json();
        
        this.setState({
            lapTimes: {
                ...this.state.lapTimes, 
                [driverId]: lapTimes
            }
        });
    }

    handleTeamClick(team) {
        this.setState({ selectedTeam: { ...team } }, () => this.fetchDrivers(this.state.selectedTeam.id));
    }

    render() {
        return (
            <>
                <div className='row'>
                    <div className='col-12 col-lg-5 mb-4'>
                        <div className='bg-white p-3'>
                            <h3>Teams</h3>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Team Principal Name</th>
                                        <th scope='col' width='10%'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.teams.length === 0
                                            ? (<tr><td colSpan='2' className='text-center'><span className='fst-italic text-muted'>No data</span></td></tr>)
                                            : this.state.teams.map(t => (
                                                <tr key={t.id}
                                                    className={`highlight-on-hover ${this.state.selectedTeam && this.state.selectedTeam.name === t.name ? ' active' : ''}`}
                                                    onClick={() => this.handleTeamClick(t)}
                                                >
                                                    <td>{t.name}</td>
                                                    <td>{t.teamPrincipalName}</td>
                                                    <td>{'>>'}</td>
                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
    
                    <div className='col-12 col-lg-7 mb-4'>
                        {this.state.drivers.map(d => (
                            <div key={d.id} className='row mb-4'>
                                <div className='col'>
                                    <div className='bg-white p-3'>
                                        <h5>Lap times for: {d.name} (Driver #{d.number})</h5>
                                        <table className='table'>
                                            <thead>
                                            <tr>
                                                <th scope='col'>Sector 1</th>
                                                <th scope='col'>Sector 2</th>
                                                <th scope='col'>Sector 3</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                !this.state.lapTimes[d.id] 
                                                    ? (<tr><td colSpan='4' className='text-center'><span className='fst-italic text-muted'>No data</span></td></tr>) 
                                                    : this.state.lapTimes[d.id].map(t => (
                                                        <tr key={t.id}>
                                                            <td>{t.sector1ElapsedTime.toFixed(3)}s</td>
                                                            <td>{t.sector2ElapsedTime.toFixed(3)}s</td>
                                                            <td>{t.sector3ElapsedTime.toFixed(3)}s</td>
                                                        </tr>
                                                    ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>    
                        ))}
                    </div>
                </div>
                {this.renderLoadingSpinner()}
            </>
        );
    }

    renderLoadingSpinner() {
        if (this.state.loadingCount === 0)
            return null;
        
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className='bg-white p-5'>
                    <span className={'fst-italic'}>Loading ({this.state.loadingCount})...</span>
                </div>
            </div>
        );
    }
}

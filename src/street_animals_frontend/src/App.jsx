import React, { useState, useEffect } from 'react';

// Hayvan listesini ve formu kapsayan ana bileşen
function App() {
    const [animals, setAnimals] = useState([]); // Hayvan verilerini saklamak için state
    const [formData, setFormData] = useState({
        species: '',
        location: '',
        healthStatus: '',
        needsHelp: 'false',
        photoUrl: ''
    }); // Form verisi için state

    // Component yüklendiğinde hayvan verilerini backend'den al
    useEffect(() => {
        fetchAnimals();
    }, []);

    // Hayvan listesini almak için API çağrısı
    const fetchAnimals = async () => {
        try {
            const response = await fetch('/api/animals'); // Backend URL'sini güncelleyebilirsiniz
            const data = await response.json();
            setAnimals(data);
        } catch (error) {
            console.error('Hayvan verileri alınamadı:', error);
        }
    };

    // Form verisini güncelle
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Yeni hayvan raporunu göndermek için API çağrısı
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/report-animal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchAnimals(); // Yeni veriyi almak için hayvan listesini güncelle
                setFormData({ species: '', location: '', healthStatus: '', needsHelp: 'false', photoUrl: '' }); // Formu sıfırla
            } else {
                console.error('Hayvan raporu gönderilemedi');
            }
        } catch (error) {
            console.error('Hata oluştu:', error);
        }
    };

    return (
        <div className="app">
            <header>
                <h1>Sokak Hayvanları Yönetimi</h1>
            </header>

            <main>
                {/* Hayvan Listesi */}
                <section className="animal-list">
                    <h2>Hayvan Listesi</h2>
                    <ul>
                        {animals.map((animal) => (
                            <li key={animal.id}>
                                <h3>{animal.species}</h3>
                                <p>Konum: {animal.location}</p>
                                <p>Sağlık Durumu: {animal.health_status}</p>
                                <p>Yardıma İhtiyaç: {animal.needs_help ? 'Evet' : 'Hayır'}</p>
                                <p>Raporlayan: {animal.reporter}</p>
                                <img src={animal.photo_url} alt={`${animal.species} fotoğrafı`} style={{ maxWidth: '200px' }} />
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Yeni Hayvan Raporu Formu */}
                <section className="report-form">
                    <h2>Yeni Hayvan Raporla</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Tür:
                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        <label>
                            Konum:
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        <label>
                            Sağlık Durumu:
                            <input
                                type="text"
                                name="healthStatus"
                                value={formData.healthStatus}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        <label>
                            Yardıma İhtiyacı Var mı?
                            <select
                                name="needsHelp"
                                value={formData.needsHelp}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="true">Evet</option>
                                <option value="false">Hayır</option>
                            </select>
                        </label>

                        <label>
                            Fotoğraf URL:
                            <input
                                type="text"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        <button type="submit">Raporla</button>
                    </form>
                </section>
            </main>

            <footer>
                <p>&copy; 2024 Sokak Hayvanları Yönetim Sistemi</p>
            </footer>
        </div>
    );
}

export default App;

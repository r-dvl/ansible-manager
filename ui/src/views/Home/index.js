import React, { useState, useEffect } from 'react';

export default function Home(){
  const [playbooks, setPlaybooks] = useState([]);

  useEffect(() => {
    const fetchPlaybooks = async () => {
      try {
        const response = await fetch('http://192.168.1.41:8080/v1/playbooks/get-playbooks'); // Reemplaza con tu **API endpoint**
        const data = await response.json();
        setPlaybooks(data.playbooks);
      } catch (error) {
        console.error('Error al obtener los *playbooks*:', error);
      }
    };

    fetchPlaybooks();
  }, []);

  return (
    <div>
      <h1>Playbooks Disponibles</h1>
      <div>
        {playbooks.map((playbook, index) => (
          <button key={index}>{playbook}</button>
        ))}
      </div>
    </div>
  );
};
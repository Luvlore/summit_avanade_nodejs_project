/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  Input,
  Button,
} from 'reactstrap';
import Table from './table';

export default props => {
  const [totalTables, setTotalTables] = useState([]);
  const [tables, setTables] = useState([]);
  // Seleções do usuário
  const [selection, setSelection] = useState({
    table: { name: null, id: null },
    date: new Date(),
    time: null,
    location: 'local',
    size: 0,
  });

  // Dados da reserva do usuário
  const [booking, setBooking] = useState( { name: '', phone: '', email: '' });

  // Locais e horários de reserva
  const locations = ['Curitiba', 'São Paulo', 'Recife', 'Maceió', 'Belo Horizonte', 'Salvador'];
  const times = [
    '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM',
  ];

  // Validações de reservas
  const [reservationError, setReservationError] = useState(false);
  const getDate = useCallback(() => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Desembro'
    ]
    const date = `${months[selection.date.getMonth()]}/${selection.date.getDate()}/${selection.date.getFullYear()}`;
    const time = selection.time > 12
      ? `${selection.time.slice(0, -2)} 12:00`
      : `${selection.time.slice(0, -2)}:00`;
    const dateTime = new Date(`${date} ${time}`)
    return dateTime;
  }, [selection.date, selection.time])

  const getEmptyTables = () =>  totalTables.filter((table) => table.isAvailable).length;

  // Verificar disponibilidade de assentos na data e hora selecionadas
  const checkAvailabity = useCallback(async () => {
    if (selection.time && selection.date) {
      const date = getDate();
      const response = await fetch('https://localhost:3005/availability', {
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringfy({ date })
      });
      const data = await response.json();

      // Mostrar apenas assentos disponíveis
      const tables = data.tables.filter((table) => (selection.size > 0
        && table.capacity >= selection.size)
        && (selection.location !== 'local' && table.location === selection.location))
      setTotalTables(tables);
    }
  }, [getDate, selection.date, selection.location, selection.size, selection.time])

  useEffect(() => {
    checkAvailabity()
  }, [checkAvailabity])

  // Fazer a reserva se todos os adados estiverem preenchidos

  const checkErrors = useCallback(async () => {
    const errors = [
      booking.name.length === 0,
      booking.phone.length === 0,
      booking.email.length === 0,
    ];

    setReservationError(errors.some((error) => error));
  }, [booking.email.length, booking.name.length, booking.phone.length]);

  useEffect(() => {
    checkErrors();
  }, [checkErrors])

  const reserve = async () => {
    if (!reservationError) {
      const date = getDate();
      const response = await fetch('https://localhost:3005/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...booking,
          date,
          table: selection.table.id,
        })
      });
      const data = await response.text();
      console.log('Reserva:' + data);
      props.setPage(2);
    } else return console.log('Complete seus dados!')
  }

  const selectTable = (name, id) => {
    setSelection({
      ...selection,
      table: { name, id },
    });
  }

  const getSizes = () => {
    const newSizes = [];

    for (let i = 1; i < 8; i =+ 1) {
      newSizes.push(
        <DropdownItem
          key={ i }
          className="boocking-dropdown-item"
          onChange={ () => {
            const newSel = {
              ...selection,
              table : {
                ...selection.table,
              },
              size: i,
            };
            setSelection(newSel);
          } }
        >
          {i}
        </DropdownItem>
      );
    }

    return newSizes;
  }

  return (
    <div>
      <Col>
        {getEmptyTables() > 0
          && <p className="available-tables">{getEmptyTables()} available</p> }

        {selection.date && selection.time ? (
          getEmptyTables() > 0 ? (
            <div>
              <div className="table-key">
                <span className="empty-table"></span> &nbsp; Available
                &nbsp;&nbsp;
                <span className="full-table"></span> &nbsp; Unavailable
                &nbsp;&nbsp;
              </div>
              <Row noGutters>{
                totalTables.map((table) => (
                  <Table
                    key={ table._id }
                    id={ table._id }
                    chairs={ table.capacity }
                    name={ table.name }
                    empty={ table.isAvailable }
                    selectTable={ selectTable }
                  />
                ))
              }</Row>
            </div>
          ) : (
            <p className="table-display-message">Sem reservas disponíveis </p>
          )
        ) : (
          <p className="table-display-message">
            Selecione uma data e um horário para a sua reserva
          </p>
        )}
      </Col>

    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button
} from 'reactstrap';
import Table from '../table';

export default function Boock({ setPage }) {
  const [totalTables, setTotalTables] = useState([]);

  // User's selections
  const [selection, setSelection] = useState({
    table: { name: '', id: '' },
    date: new Date(),
    time: null,
    location: 'Local',
    size: 0
  });

  // User's booking details
  const [booking, setBooking] = useState({ name: '', phone: '', email: '' });

  // List of potential locations and sizes
  const locations = ['Curitiba', 'Patio', 'Inside', 'Bar'];
  const times = [
    '8AM', '9AM', '10AM', '11AM', '12PM',
    '1PM', '2PM', '3PM', '4PM', '5PM'
  ];
  const sizes = Array.from({ length: 8 }, (_, index) => index);
  // Basic reservation 'validation'
  const [reservationError, setReservationError] = useState(false);

  const getDate = useCallback(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const { date, time } = selection;
    const dateFormated = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    const timeFormated = time > 12
      ? `${time.slice(0, -2)} 12:00`
      : `${time.slice(0, -2)}:00`;
    const dateTime = new Date(`${dateFormated} ${timeFormated}`)
    return dateTime;
  }, [selection]);

  const getEmptyTables = totalTables.filter(table => table.isAvailable).length;

  const checkAvailability = useCallback(async () => {
    const date = getDate();
    const res = await fetch('http://localhost:3005/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date }),
    });
    const data = await res.json();
    // Filter available tables with location and group size criteria
    const tables = data.tables.filter((table) => {
        const { location, size } = selection;
        const checkTable = [
          location === table.location,
          table.capacity >= size,
        ];

        if (size !== 0 && location !== 'Local') return checkTable[0] && checkTable[1];
        if (location !== 'Local') return checkTable[0];
        if (size !== 0) return checkTable[1];
        return table;
      }
    );
    console.log(tables);
    setTotalTables(tables);
  }, [getDate, selection]);

  useEffect(() => {
    // Check availability of tables from DB when a date and time is selected
    if (selection.time && selection.date) {
      checkAvailability()
    }
  }, [checkAvailability, selection.date, selection.time]);

  // Make the reservation if all details are filled out
  const reserve = async () => {
    if (reservationError) {
      const date = getDate();
      const res = await fetch('http://localhost:3005/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...booking,
          date,
          table: selection.table.id
        })
      });
      const data = await res.text();
      console.log('Reserved: ' + data);
      setPage(2);
    }
  };

  const checkErrors = useCallback(() => {
    const { name, phone, email } = booking;
    const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validatePhone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    const errors = [
      name.length < 3,
      !validateEmail.test(email),
      !validatePhone.test(phone),
    ];

    setReservationError(errors.some((error) => error));
  }, [booking]);

  useEffect(() => {
    checkErrors();
  }, [checkErrors]);

  // Clicking on a table sets the selection state
  const selectTable = (name, id) => setSelection({ ...selection, table: { name, id } });

  // Generate dropdowns
  const getItems = (array, type) => {
    const key = {
      loc: 'location',
      time: 'time',
      size: 'size'
    }

    return array.map(item => (
      <DropdownItem
        key={item}
        className='booking-dropdown-item'
        onClick={() =>  setSelection({ ...selection, [key[type]]: item }) }
      >
        {item}
      </DropdownItem>
    ))
  };

  return (
    <div>
      <Row noGutters className='text-center align-items-center assento-cta'>
        <Col>
          <p className='looking-for-assento'>
            {!selection.table.id ? 'Book a Table' : 'Confirme seus dados'}
            <i
              className={
                !selection.table.id
                  ? 'fas fa-chair assento'
                  : 'fas fa-clipboard-check assento'
              }
            />
          </p>
          <p className='selected-table'>
            {selection.table.id && 'Você está reservando o ' + selection.table.name}
          </p>

          {reservationError && (
            <p className='reservation-error'>
              * Please fill out all of the details.
            </p>
          ) }
        </Col>
      </Row>

      {!selection.table.id ? (
        <div id='reservation-stuff'>
          <Row noGutters className='text-center align-items-center'>
            <Col xs='12' sm='3'>
              <input
                type='date'
                required='required'
                className='booking-dropdown'
                value={ selection.date.toISOString().split('T')[0] }
                onChange={ ({ target: { value } }) => {
                  const currentYear = new Date(new Date() - 1000 * 3600 * 24);
                  const dateSelected = new Date(value);
                  const dateValid = dateSelected > currentYear;
                  setSelection({
                    ...selection,
                    date: dateValid ? new Date(value) : new Date(),
                  });
                }}
              />
            </Col>
            <Col xs='12' sm='3'>
              <UncontrolledDropdown>
                <DropdownToggle color='none' caret className='booking-dropdown'>
                  {selection.time === null ? 'Selecione um horário' : selection.time}
                </DropdownToggle>
                <DropdownMenu right className='booking-dropdown-menu'>
                  {getItems(times, 'time')}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs='12' sm='3'>
              <UncontrolledDropdown>
                <DropdownToggle color='none' caret className='booking-dropdown' disabled={ selection.time === null }>
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu right className='booking-dropdown-menu'>
                  {getItems(locations, 'loc')}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs='12' sm='3'>
              <UncontrolledDropdown>
                <DropdownToggle color='none' caret className='booking-dropdown' disabled={ selection.time === null }>
                  {selection.size === 0
                    ? 'Número de passageiros'
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu right className='booking-dropdown-menu'>
                  {getItems(sizes, 'size')}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row noGutters className='tables-display'>
            <Col>
              {getEmptyTables > 0
                && <p className='available-tables'>{getEmptyTables} available</p> }

              {
                selection.date && selection.time ? (
                  getEmptyTables > 0 ? (
                    <div>
                      <Row noGutters>
                        {
                          getEmptyTables > 0 && totalTables
                            .map((table) => table.isAvailable && (
                              <Table
                                key={ table._id }
                                id={ table._id }
                                chairs={ table.capacity }
                                name={ table.name }
                                empty={ table.isAvailable }
                                selectTable={ selectTable }
                              />
                            ))
                        }
                      </Row>
                    </div>
                  ) : (
                    <p className='table-display-message'>Sem reservas disponíveis </p>
                  )
                ) : (
                  <p className='table-display-message'>
                    Selecione uma data e um horário para a sua reserva
                  </p>
                )
              }
            </Col>
          </Row>
        </div>
      ) : (
        <div id='confirm-reservation-stuff'>
          <Row
            noGutters
            className='text-center justify-content-center reservation-details-container'
          >
            <Col xs='12' sm='3' className='reservation-details'>
              <Input
                type='text'
                bsSize='lg'
                placeholder='Nome'
                className='reservation-input'
                value={ booking.name }
                onChange={ ({ target }) => setBooking({ ...booking, name: target.value }) }
              />
            </Col>
            <Col xs='12' sm='3' className='reservation-details'>
              <Input
                type='text'
                bsSize='lg'
                placeholder='Número de telefone'
                className='reservation-input'
                value={ booking.phone }
                onChange={ ({ target }) => setBooking({ ...booking, phone: target.value }) }
              />
            </Col>
            <Col xs='12' sm='3' className='reservation-details'>
              <Input
                type='text'
                bsSize='lg'
                placeholder='Email'
                className='reservation-input'
                value={ booking.email }
                onChange={ ({ target }) => setBooking({ ...booking, email: target.value }) }
              />
            </Col>
          </Row>
          <Row noGutters className='text-center'>
            <Col>
              <Button
                color='none'
                className='book-table-btn'
                onClick={ reserve }
              >
                Finalizar Reserva
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

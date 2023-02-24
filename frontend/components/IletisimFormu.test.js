import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import App from '../App'


test('hata olmadan render ediliyor', () => {
    render(<App />);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);
    const headerH1 = screen.getByTestId("header-h1");
    expect(headerH1).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    const inputName = await screen.findByTestId("input-name");
    userEvent.type(inputName, "err");
    const error = await screen.findByTestId("error");
    expect(error).toBeInTheDocument();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const submit = await screen.findByTestId("submit");
    userEvent.click(submit);
    const errors = await screen.findAllByTestId("error");
    expect(errors).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const inputName = await screen.findByTestId("input-name");
    userEvent.type(inputName, "Bertan");
    const inputSurname = await screen.findByTestId("input-surname");
    userEvent.type(inputSurname, "Sogutlu");
    const submit = await screen.findByTestId("submit");
    userEvent.click(submit);
    const errors = await screen.findAllByTestId("error");
    expect(errors).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const inputEmail = await screen.findByTestId("input-email");
    userEvent.type(inputEmail, "bertan");
    const mesajEmail = await screen.findByText("Hata: email geçerli bir email adresi olmalıdır.");
    expect(mesajEmail).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const inputName = await screen.findByTestId("input-name");
    userEvent.type(inputName, "Bertan");
    const inputEmail = await screen.findByTestId("input-email");
    userEvent.type(inputEmail, "bertan@gmail.com");
    const submit = await screen.findByTestId("submit");
    userEvent.click(submit);
    const errors = await screen.findAllByTestId("error");
    expect(errors).toHaveLength(1);
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);
    const inputName = await screen.findByTestId("input-name");
    userEvent.type(inputName, "Bertan");
    const inputSurname = await screen.findByTestId("input-surname");
    userEvent.type(inputSurname, "Sogutlu");
    const inputEmail = await screen.findByTestId("input-email");
    userEvent.type(inputEmail, "bertan@gmail.com");
    const submit = await screen.findByTestId("submit");
    userEvent.click(submit);
    const errors = screen.queryAllByTestId("error")
    expect(errors).toHaveLength(0);
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    const inputName = await screen.findByTestId("input-name");
    userEvent.type(inputName, "Bertan");
    const inputSurname = await screen.findByTestId("input-surname");
    userEvent.type(inputSurname, "Sogutlu");
    const inputEmail = await screen.findByTestId("input-email");
    userEvent.type(inputEmail, "bertan@gmail.com");
    const inputMessage = await screen.findByTestId("input-message");
    userEvent.type(inputMessage, "form dolduruldu");
    const submit = await screen.findByTestId("submit");
    userEvent.click(submit);
    const firstnameDisplay = await screen.findByTestId("firstnameDisplay");
    expect(firstnameDisplay).toHaveTextContent("Bertan");
    const lastnameDisplay = await screen.findByTestId("lastnameDisplay");
    expect(lastnameDisplay).toHaveTextContent("Sogutlu");
    const emailDisplay = await screen.findByTestId("emailDisplay");
    expect(emailDisplay).toHaveTextContent("bertan@gmail.co");
    const messageDisplay = await screen.findByTestId("messageDisplay");
    expect(messageDisplay).toHaveTextContent("form dolduruldu");
});

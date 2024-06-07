import React, { FC, useState } from 'react';
import Modal from './Modal'; // Asegúrate de tener un componente Modal disponible
import axios from 'axios';
import { IToast, dangerToast, defaultSuccessToast } from '@/interfaces/IToast';
import ToastList from './ToastList';
import Input from './Input';


interface TestProps {
    className?:string,
    disabled?:boolean,
    email: string
    password: string,
    pop:string
    imap:string
    smtp: string
    puerto: number
}

const EmailButton: FC<TestProps> = ({
    className,
    disabled,
    email,
    password,
    pop,
    imap,
    smtp,
    puerto,
  }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailEnvio, setEmailEnvio] = useState("");
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [loading,setLoading] = useState(false)

  const handleButtonClick = () => {
    if (!emailvalido()) {
      setToasts([...toasts, dangerToast("Falta agregar datos ")]);
    }else{
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSendEmail = async () => {
    // Configuración 
    const data = {
        email : email,
        password: password,
        pop: pop,
        imap: imap,
        smtp: smtp,
        puerto:puerto,
        emailEnvio:emailEnvio
    }

    try {
        setLoading(true)
        const response = await axios.post('/api/smtpMail',{data},{headers:{'Content-Type':'application/json'}})
        if (response.status===200) {
          setToasts([...toasts, defaultSuccessToast]) 
        }else{
          setToasts([...toasts, dangerToast("Datos no validos SMTP")]);
        }
        setIsModalOpen(false);
      
    } catch (error) {
      setToasts([...toasts, dangerToast("Datos no validos SMTP")]);
      setIsModalOpen(false);
    } finally {
      setLoading(false)
    }

  };

  const emailvalido = () => {

    if (email==="" || puerto===0 || password==="") {
      return false
    }
    if (smtp!="") {
      return true
      
    }
    
    return false
  }


  return (
    <div className={className}>
      <button disabled={disabled} className='py-2 px-4 border border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white' onClick={handleButtonClick}>Test</button>
      {isModalOpen && (
        <Modal type="info" title="Configuración de Email" onClose={handleModalClose}>

            <div className='grid grid-cols-2'>
              <Input
                type="email"
                label='Email de llegada del correo de prueba'
                name="Email de llegada"
                className='w-full'
                placeholder="Email de Envio"
                value={emailEnvio}
                onChange={(e) => setEmailEnvio(e.target.value) }
              />


              <button className='p-2 m-6 w-full border border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white disabled:opacity-50' 
              onClick={handleSendEmail} disabled={emailEnvio===""} >
              {loading && <div className="flex justify-center" role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>}

                {!loading && <span>Enviar Correo de Prueba</span>}
                
                </button>
          </div>  
         </Modal>
      )}
      <ToastList toasts={toasts} setToasts={setToasts}/>
    </div>
  );
};

export default EmailButton;
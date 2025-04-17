import React , {useEffect, useState} from 'react'
import Footer from '../component/Footer'
import Header from '../component/Header'
import icons from '../constant/icons'
import { NavLink } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js';
import Loader from '../component/Loader'
// Initialisation du client Supabase
const supabase = createClient(
  "https://alnyevekfotvgurlshew.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbnlldmVrZm90dmd1cmxzaGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTA2MjgsImV4cCI6MjA1ODkyNjYyOH0.TuI3kmlRPsCTZbzl_ucv6Ehd7RSfG5HHq6V_f0zDKp0"
);

export default function Depenses() {

  const [showAddItem, setShowAddItem] = useState(false)
  const [showEditItem, setShowEditItem] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editItem, setEditItem] = useState({
      description: '',
      date: new Date().toLocaleDateString(),
      montant: 0,
  })
  const [dataItem, setDataItem] = useState({
      name: '',
      date: new Date().toLocaleDateString(),
      price: 0,
  })
  const [data, setData] = useState([])

  const handleAddItemClick = () => {
    setShowAddItem(!showAddItem)
  }

  const handleEditItemClick = (item) => {
    if(editItem){
        setEditItem(null)
        setShowEditItem(false)
    }
    setEditItem(item)
    setShowEditItem(!showEditItem)
  }

  const handleChangeDataItem = (e) => {
    const { name, value } = e.target
    setDataItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangeEditItem = (e) => {
    const { name, value } = e.target
    setEditItem((prev) => ({ ...prev, [name]: value }))
  }


  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
          .from('depenses')
          .select('*')
      if (error) {
          console.log(error)
      } else {
          setData(data)
      }
  }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { name, date, price } = dataItem
    if (!name || !date || !price) {
        alert('Veuillez remplir tous les champs')
        return
    }
    const { error } = await supabase
        .from('depenses')
        .insert([
            { description:name, date, montant:price }
        ])
    if (error) {
        throw error
    } else {
        setShowAddItem(false)
        setDataItem({
            name: '',
            date: new Date().toLocaleDateString(),
            price: 0,
        })
        alert('Depense Ajoutée avec succès')
        window.location.reload()
    }
  }
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { description, date, montant } = editItem
    if (!description || !date || !montant) {
        alert('Veuillez remplir tous les champs')
        return
    }
    const { error } = await supabase
        .from('depenses')
        .update({ description, date, montant })
        .eq('id', editItem.id)

    if (error) {
        throw error
    } else {
        setShowEditItem(false)
        setEditItem({
            name: '',
            date: new Date().toLocaleDateString(),
            price: 0,
        })
        alert('Depense Modifie avec succès')
        window.location.reload()
    }
  }

  const handleDeleteItem = async (id) => {
    const { error } = await supabase
        .from('depenses')
        .delete()
        .eq('id', id)
    if (error) {
        throw error
    } else {
        alert('Depense Supprimée avec succès')
        window.location.reload()
    }
  }

  return (
    <div className='flex w-full justify-center '>
        <div className='w-full max-w-[600px] h-screen'>
            <Header title="Depenses" icon="LuCreditCard" />
            <div className='w-full h-12 flex justify-center items-center fixed max-w-[600px] top-20 px-2'>
                <div className='w-full h-full bg-white rounded-lg flex justify-center items-center shadow-sm shadow-black-20 border '>
                    <input type="text" placeholder='Rechercher un produit' className='w-full h-full rounded-lg px-2 text-sm outline-none' />
                </div>
            </div>
            <div className='w-full h-auto gap-4 flex flex-col justify-center items-center mt-36 px-2 pb-44'>
                {
                    data &&
                    data.map((item, index) => (
                        <div className='w-full h-24 bg-white rounded-lg shadow-sm shadow-black-20 border flex justify-between items-center p-2'>
                            <div className='flex flex-col justify-center items-start w-1/2 h-full'>
                                <span className='font-Montserrat text-sm font-bold w-full break-words'>{item.description}</span>
                            </div>
                            <div className='flex flex-col justify-center items-end 1/4 h-full gap-2'>
                                <span className='font-Montserrat text-sm font-bold text-red-500'>{item.montant} Fcfa</span>
                                <div className='font-Montserrat text-xs flex gap-2 '>
                                  <icons.MdOutlineDateRange  />
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                                <div className='flex gap-4'>
                                    <icons.BiSolidEdit onClick={() => handleEditItemClick(item)} className='text-blue-500 text-2xl cursor-pointer' />
                                    <icons.FaRegTrashAlt onClick={() => handleDeleteItem(item.id)} className='text-red-500 text-xl cursor-pointer' />
                                </div>
                            </div>
                        </div>
                ))
              }
            </div>
            <div className='w-full flex justify-end items-edn h-16 text-xl font-Montserrat fixed max-w-[600px] bottom-20 z-10'>
                <NavLink onClick={handleAddItemClick} className='w-16 h-16 bg-black rounded-full flex justify-center items-center shadow-sm shadow-black-20 border'>
                    <icons.IoAdd className='text-white' />
                </NavLink>
            </div>
            <Footer />
        </div>
        <div className={'w-full max-w-[600px] fixed bg-black/20 top-0' + (showAddItem || showEditItem ? ' h-screen' : ' h-0') }>

        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showAddItem ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Ajouter une depense</span>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={handleAddItemClick} />
                </div>
                <form action="" className='mt-10 w-full'>
                    <label htmlFor="name" className='w-full flex flex-col justify-start items-start gap-2'>
                        <span className='font-Montserrat text-sm'>Description</span>
                        <input type="text" value={dataItem.name} placeholder='Chemise pour femme' onChange={handleChangeDataItem} name='name' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    <div className='w-full flex justify-between items-center gap-4 mt-4'>
                        <label htmlFor="price" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Montant (Fcfa)</span>
                            <input type="number" value={dataItem.price} placeholder='200' onChange={handleChangeDataItem} name='price' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                    </div>
                    <label htmlFor="category" className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <span className='font-Montserrat text-sm'>Date</span>
                        <input type="date" value={dataItem.date} onChange={handleChangeDataItem} name='date' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    {
                        loading ? <Loader /> :
                        <button onClick={handleSubmit} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                            Ajouter
                        </button>
                    }
                </form>
            </div>
        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showEditItem ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Modifier une depense</span>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={handleAddItemClick} />
                </div>
                <form action="" className='mt-10 w-full'>
                    <label htmlFor="name" className='w-full flex flex-col justify-start items-start gap-2'>
                        <span className='font-Montserrat text-sm'>Description</span>
                        <input type="text" value={editItem.description} placeholder='Chemise pour femme' onChange={handleChangeEditItem} name='description' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    <div className='w-full flex justify-between items-center gap-4 mt-4'>
                        <label htmlFor="price" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Montant (Fcfa)</span>
                            <input type="number" value={editItem.montant} placeholder='200' onChange={handleChangeEditItem} name='montant' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                    </div>
                    <label htmlFor="category" className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <span className='font-Montserrat text-sm'>Date</span>
                        <input type="date" value={editItem.date} onChange={handleChangeEditItem} name='date' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    {
                        loading ? <Loader /> :
                        <button onClick={handleEditSubmit} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                            Modifier
                        </button>
                    }
                </form>
            </div>
        </div>
    </div>
  )
}

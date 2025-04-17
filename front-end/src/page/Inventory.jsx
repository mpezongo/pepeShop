import React, { useEffect, useState } from 'react'
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

export default function Inventory() {
    const [showAddItem, setShowAddItem] = useState("")
    const [showEditItem, setShowEditItem] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [dataItem, setDataItem] = useState({
        name: '',
        quantity: 0,
        price: 0,
        category: ''
    })
    const [loading, setLoading] = useState(false)
    const [dataItemBallot, setDataItemBallot] = useState({
        name: '',
        quantity: 0,
        price: 0,
        category: ''
    })
    const [image, setImage] = useState(null)
    const [editImage, setEditImage] = useState(null)

    const [data, setData] = useState()
    const [ballot, setBallot] = useState()

    const handleAddItemClick = (value) => {
        setShowAddItem(value)
    }
    const handleEditItemClick = (item) => {
        if(editItem){
            setEditItem(null)
            setShowEditItem(false)
        }
        setEditItem(item)
        setShowEditItem(!showEditItem)
    }

    const handleChangeEditItem = (e) => {
        const { name, value } = e.target
        setEditItem((prev) => ({ ...prev, [name]: value }))
    }

    const handleChangeDataItem = (e) => {
        const { name, value } = e.target
        setDataItem((prev) => ({ ...prev, [name]: value }))
    }
    const handleChangeDataItemBallot = (e) => {
        const { name, value } = e.target
        setDataItemBallot((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };
    const handleEditFileChange = (event) => {
        setEditImage(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { name, quantity, price, category } = dataItem
        if (!name || !quantity || !price || !category) {
            alert('Veuillez remplir tous les champs')
            return
        }
        if (!image) {
            alert('Veuillez ajouter une image')
            return
        }
        const fileName = `${Date.now()}`
        try{
            const { data: uploadImgData, error:uploadImgError } = await supabase.storage
                .from('images')
                .upload(fileName, image)

            if (uploadImgError) throw uploadImgError

            console.log(uploadImgData)
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(uploadImgData.path)
            const { error } = await supabase
                .from('articles')
                .insert([
                    { name, quantity, price, category, img:urlData.publicUrl, type: "pretAporter" }
                ])
            if (error) {
                console.log(error)
            } else {
                setShowAddItem(false)
                setDataItem({
                    name: '',
                    quantity: '',
                    price: '',
                    category: ''
                })
                setImage(null)
                alert('Article ajouté avec succès')
                window.location.reload()
            }
        }catch(error){
            console.log(error)
        }
    }
    const handleSubmitFripperie = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { name, quantity, price, category } = dataItemBallot
        if (!name || !quantity || !price || !category) {
            alert('Veuillez remplir tous les champs')
            return
        }
        if (!image) {
            alert('Veuillez ajouter une image')
            return
        }
        const fileName = `${Date.now()}`
        try{
            const { data: uploadImgData, error:uploadImgError } = await supabase.storage
                .from('images')
                .upload(fileName, image)

            if (uploadImgError) throw uploadImgError

            console.log(uploadImgData)
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(uploadImgData.path)
            const { error } = await supabase
                .from('articles')
                .insert([
                    { name, quantity, price, category, img:urlData.publicUrl, type: "ballot" }
                ])
            if (error) {
                console.log(error)
            } else {
                setShowAddItem("")
                setDataItemBallot({
                    name: '',
                    quantity: '',
                    price: '',
                    category: ''
                })
                setImage(null)
                alert('Ballot ajouté avec succès')
                window.location.reload()
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
            if (error) {
                console.log(error)
            } else {
                setData(data)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('ballot')
                .select('*')
            if (error) {
                console.log(error)
            } else {
                setBallot(data)
            }
        }
        fetchData()
    }, [])

    const deleteArticle = async (article) => {
        try {
            // supprimer aussi l'image de la base de données
            const { error: deleteImgError } = await supabase.storage
                .from('images')
                .remove([article.img])
            if (deleteImgError) throw deleteImgError
          const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', article.id)
      
          if (error) throw error
          alert('Article supprimé avec succès')
          window.location.reload()
        } catch (error) {
            if (error.code === '23503') {
            alert('Impossible de supprimer cet article car il est référencé dans d\'autres tables.')
            } else {
                console.error(error)}
          return false
        }
    }

    const handleEditItemSubmit = async (e) => {
        e.preventDefault()
        const { name, quantity, price, category } = editItem
        if (!name || !quantity || !price || !category) {
            alert('Veuillez remplir tous les champs')
            return
        }
        if (!editImage) {
            alert('Veuillez ajouter une image')
            return
        }
        const fileName = `${Date.now()}`
        try {

            // Supprimer l'ancienne image de la base de données
            const { error: deleteImgError } = await supabase.storage
                .from('images')
                .remove([editItem.img])
            if (deleteImgError) throw deleteImgError

            const { error: uploadImgError } = await supabase.storage
                .from('images')
                .upload(fileName, editImage)
            if (uploadImgError) throw uploadImgError

            // recuperer l'url de l'image
            const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(fileName)
            if (urlData.error) throw urlData.error


            const { error } = await supabase
                .from('articles')
                .update({ name, quantity, price, category, img: urlData.publicUrl, stock: quantity })
                .eq('id', editItem.id)
            if (error) throw error
            alert('Article modifié avec succès')
            setShowEditItem(false)
            window.location.reload()
        } catch (error) {
            console.error('Erreur modification article:', error.message)
        }
    }

    console.log(ballot)
  return (
    <div className='flex w-full justify-center '>
        <div className='w-full max-w-[600px] h-screen'>
            <Header title="Stock" icon="PiCubeDuotone" />
            <div className='w-full h-12 flex justify-center items-center fixed max-w-[600px] top-20 px-2'>
                <div className='w-full h-full bg-white rounded-lg flex justify-center items-center shadow-sm shadow-black-20 border '>
                    <input type="text" placeholder='Rechercher un produit' className='w-full h-full rounded-lg px-2 text-sm outline-none' />
                </div>
            </div>
            <div className='w-full h-auto gap-4 flex flex-col justify-center items-center mt-36 px-2 pb-44'>
                {
                    data &&
                    data.map((item, index) => (
                        <div key={index} className='w-full h-28 bg-white rounded-lg shadow-sm shadow-black-20 border flex justify-between items-center p-2'>
                            <div className='flex flex-col justify-start items-start w-1/4 h-full'>
                                <img src={item.img} alt="" className='h-full object-contain rounded-lg' />
                            </div>
                            <div className='flex flex-col justify-center items-start w-1/2 h-full'>
                                <span className='font-Montserrat text-sm font-bold'>{item.name}</span>
                                <span className='font-Montserrat text-xs '>{item.category}</span>
                                <span className='font-Montserrat text-xs italic font-bold'>{item.type}</span>
                            </div>
                            <div className='flex flex-col justify-center items-end 1/4 h-full gap-2'>
                                <span className='font-Montserrat text-sm font-bold text-green-500'>{item.price} Fcfa</span>
                                <span className='font-Montserrat text-xs '>Qte Achete:{item.quantity}</span>
                                <span className='font-Montserrat text-xs '>Stock:{item.quantity - item.buyNbr}</span>
                                <div className='flex gap-4'>
                                    <icons.BiSolidEdit className='text-blue-500 text-2xl cursor-pointer' onClick={() => handleEditItemClick(item)}/>
                                    <icons.FaRegTrashAlt className='text-red-500 text-xl cursor-pointer' onClick={() => deleteArticle(item)}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='w-full flex justify-end items-edn h-16 text-xl font-Montserrat fixed max-w-[600px] bottom-20 z-10'>
                <NavLink onClick={() => handleAddItemClick("pretAporter")} className='w-16 h-16 bg-black rounded-full flex justify-center items-center shadow-sm shadow-black-20 border'>
                    <icons.IoAdd className='text-white' />
                </NavLink>
            </div>
            <Footer />

        </div>
        <div className={'w-full max-w-[600px] fixed bg-black/20 top-0' + (showAddItem === "fripperie" || showAddItem === "pretAporter" || showEditItem ? ' h-screen' : ' h-0') }>

        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showAddItem === "pretAporter" ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Ajouter un article</span>
                    <button className='text-white p-2 rounded-lg bg-green-500 text-sm' onClick={() => handleAddItemClick("fripperie")}>Fripperie</button>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={() => handleAddItemClick("")} />
                </div>
                <form action="" className='mt-10 w-full'>
                    <label htmlFor="name" className='w-full flex flex-col justify-start items-start gap-2'>
                        <span className='font-Montserrat text-sm'>Nom de l'article</span>
                        <input type="text" value={dataItem.name} placeholder='Chemise pour femme' onChange={handleChangeDataItem} name='name' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    <div className='w-full flex justify-between items-center gap-4 mt-4'>
                        <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Quantite</span>
                            <input type="number" value={dataItem.quantity} placeholder='10' onChange={handleChangeDataItem} name='quantity' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                        <label htmlFor="price" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Prix d'achat (Fcfa)</span>
                            <input type="number" value={dataItem.price} placeholder='200' onChange={handleChangeDataItem} name='price' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                    </div>
                    <label htmlFor="category" className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <span className='font-Montserrat text-sm'>Categorie</span>
                        <select name="category" id="" value={dataItem.category} className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'  onChange={handleChangeDataItem} >
                            <option value="">Selectionner une categorie</option>
                            <option value="vetements">Vêtements</option>
                            <option value="chaussures">Chaussures</option>
                            <option value="accessoires">Accessoires</option>
                            <option value="bijoux">Bijoux</option>
                            <option value="autres">Autres</option>
                        </select>
                    </label>
                    <div className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <label htmlFor="">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                        </label>
                        <div style={{ marginTop: "10px" }}>
                            {image &&
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    style={{ width: "100px", height: "100px", margin: "5px", objectFit: "cover" }}
                                />
                            }
                        </div>
                    </div>
                    {
                        loading ? <Loader /> :
                        <button onClick={handleSubmit} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                            Ajouter
                        </button>
                    }
                </form>
            </div>
        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showAddItem === "fripperie" ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Ajouter un article</span>
                    <button className='text-white p-2 rounded-lg bg-green-500 text-sm' onClick={() => handleAddItemClick("pretAporter")}>Pret A porter</button>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={() => handleAddItemClick("")} />
                </div>
                <form action="" className='mt-10 w-full'>
                    <label htmlFor="name" className='w-full flex flex-col justify-start items-start gap-2'>
                        <span className='font-Montserrat text-sm'>Nom du ballot</span>
                        <input type="text" value={dataItemBallot.name} placeholder='Ballot vetements pour enfant' onChange={handleChangeDataItemBallot} name='name' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                    <div className='w-full flex justify-between items-center gap-4 mt-4'>
                        <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Quantite</span>
                            <input type="number" value={dataItemBallot.quantity} placeholder='10' onChange={handleChangeDataItemBallot} name='quantity' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                        <label htmlFor="price" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Prix d'achat (Fcfa)</span>
                            <input type="number" value={dataItemBallot.price} placeholder='200' onChange={handleChangeDataItemBallot} name='price' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                    </div>
                    <label htmlFor="category" className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <span className='font-Montserrat text-sm'>Categorie</span>
                        <select name="category" id="" value={dataItemBallot.category} className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'  onChange={handleChangeDataItemBallot} >
                            <option value="">Selectionner une categorie</option>
                            <option value="vetements">Vêtements</option>
                            <option value="chaussures">Chaussures</option>
                            <option value="accessoires">Accessoires</option>
                            <option value="bijoux">Bijoux</option>
                            <option value="autres">Autres</option>
                        </select>
                    </label>
                    <div className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                        <label htmlFor="">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                        </label>
                        <div style={{ marginTop: "10px" }}>
                            {image &&
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    style={{ width: "100px", height: "100px", margin: "5px", objectFit: "cover" }}
                                />
                            }
                        </div>
                    </div>
                    {
                        loading ? <Loader /> :
                        <button onClick={handleSubmitFripperie} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                            Ajouter
                        </button>
                    }
                </form>
            </div>
        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showEditItem ? ' bottom-0' : ' -bottom-[100%]')}>
            {
                editItem && (
                    <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                        <div className='w-full flex justify-between items-center'>
                            <span className='font-extrabold'>Modifier l'article</span>
                            <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={handleEditItemClick} />
                        </div>
                        <form action="" className='mt-10 w-full'>
                            <label htmlFor="name" className='w-full flex flex-col justify-start items-start gap-2'>
                                <span className='font-Montserrat text-sm'>Nom de l'article</span>
                                <input type="text" value={editItem.name} name='name' onChange={handleChangeEditItem} placeholder='Chemise pour femme' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                            </label>
                            <div className='w-full flex justify-between items-center gap-4 mt-4'>
                                <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                                    <span className='font-Montserrat text-sm'>Quantite</span>
                                    <input type="number" value={editItem.quantity} name='quantity' onChange={handleChangeEditItem} placeholder='10' className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                                </label>
                                <label htmlFor="price" className='w-full flex flex-col justify-start items-start gap-2'>
                                    <span className='font-Montserrat text-sm'>Prix d'achat (Fcfa)</span>
                                    <input type="number" placeholder='200' value={editItem.price} name='price' onChange={handleChangeEditItem} className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                                </label>
                            </div>
                            <label htmlFor="categorie" className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                                <span className='font-Montserrat text-sm'>Categorie</span>
                                <select name="quantity" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'
                                value={editItem.category || "ferver"}
                                onChange={(event) => setEditItem({ ...editItem, category: event.target.value })}>
                                    <option value="vetements">Vêtements</option>
                                    <option value="chaussures">Chaussures</option>
                                    <option value="accessoires">Accessoires</option>
                                    <option value="bijoux">Bijoux</option>
                                    <option value="autres">Autres</option>
                                </select>
                            </label>
                            <div className='w-full flex flex-col justify-start items-start gap-2 mt-4'>
                                <label htmlFor="">
                                    <input type="file" multiple accept="image/*" onChange={handleEditFileChange} />
                                </label>
                                <div style={{ marginTop: "10px" }}>
                                    {editImage &&
                                        <img
                                            src={URL.createObjectURL(editImage)}
                                            alt="preview"
                                            style={{ width: "100px", height: "100px", margin: "5px", objectFit: "cover" }}
                                        />
                                    }
                                </div>
                            </div>
                            <button onClick={handleEditItemSubmit} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                                Enregistrer
                            </button>
                        </form>
                    </div>
                )
            }
        </div>
    </div>
  )
}

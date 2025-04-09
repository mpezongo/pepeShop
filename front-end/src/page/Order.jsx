import React, {useState, useEffect} from 'react'
import Footer from '../component/Footer'
import Header from '../component/Header'
import icons from '../constant/icons'
import { NavLink } from 'react-router-dom'

import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabase = createClient(
  "https://alnyevekfotvgurlshew.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbnlldmVrZm90dmd1cmxzaGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTA2MjgsImV4cCI6MjA1ODkyNjYyOH0.TuI3kmlRPsCTZbzl_ucv6Ehd7RSfG5HHq6V_f0zDKp0"
);


// const data = [
//     {
//       id: 1,
//       clientName: "John Doe",
//       date: "2023-10-01",
//       status: "Pending",
//       price: 5000,
//       items:[
//         {
//           name: "Product 1",
//           category: "Category 1",
//           quantity: 2,
//           price: 2000,
//           image: "https://via.placeholder.com/150"
//         },
//         {
//           name: "Product 2",
//           category: "Category 2",
//           quantity: 1,
//           price: 3000,
//           image: "https://via.placeholder.com/150"
//         }
//       ]
//     },
//     {
//       id: 2,
//       clientName: "Jane Smith",
//       date: "2023-10-02",
//       status: "Completed",
//       price: 8000,
//       items:[
//         {
//           name: "Product 3",
//           category: "Category 3",
//           quantity: 1,
//           price: 8000,
//           image: "https://via.placeholder.com/150"
//         }
//       ]
//     },
//     {
//       id: 3,
//       clientName: "Alice Johnson",
//       date: "2023-10-03",
//       status: "Cancelled",
//       price: 0,
//       items:[
//         {
//           name: "Product 4",
//           category: "Category 4",
//           quantity: 1,
//           price: 0,
//           image: "https://via.placeholder.com/150"
//         }
//       ]
//     }
// ]
export default function Order() {

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [addOrder, setAddOrder] = useState({
    client: null,
    clientName: "",
    clientNumber: "",
    clientAdresse: "",
    clientEmail: "",
    status: "En attente",
  })
  // const [showEditOrder, setShowEditOrder] = useState(false);
  // const [editOrder, setEditOrder] = useState(null);
  const [showDetailOrder, setShowDetailOrder] = useState(null);
  const [data, setData] = useState()
  const [clientData, setClientData] = useState()
  const [switchAddOrder, setSwitchAddOrder] = useState(false)
  const [orderArticles, setOrderArticles] = useState({ items: [] })
  const [articlesData, setArticlesData] = useState()
  const [addOrderArticle, setAddOrderArticle] = useState()

  // const handleEditOrderClick = (item) => {
  //   setEditOrder(item);
  //   setShowEditOrder(!showEditOrder);
  // }

  const handleSetOrderArticle = (e) => {
    const { name, value } = e.target;

    setAddOrderArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const handleSetOrderArticles = (article) => {
    if (!article){
      alert("Veuillez selectionner un article")
      return
    }
    const { id, quantity, priceUnit } = article;
    if (!id || !quantity || !priceUnit) {
      alert("Veuillez remplir de l'article tous les champs")
      return
    }
    setOrderArticles((prev) => ({
      ...prev,
      items: [...(prev.items || []), article],
    }));
  };

  const handleAddOrderClick = () => {
    setShowAddOrder(!showAddOrder);
  }
  const handleChangeAddOrder = (e) => {
    const { name, value } = e.target;
    setAddOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleShowOrder = (item) => {
    setShowDetailOrder(item);
  }

  useEffect(() => {
          const fetchData = async () => {
              const { data, error } = await supabase
                  .from('client')
                  .select('*')
              if (error) {
                  console.log(error)
              } else {
                setClientData(data)
              }
          }
          fetchData()
  }, [])
  useEffect(() => {
          const fetchData = async () => {
              const { data, error } = await supabase
                  .from('articles')
                  .select('*')
              if (error) {
                  console.log(error)
              } else {
                setArticlesData(data)
              }
          }
          fetchData()
  }, [])

  useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('commandes')
                .select(`
                  id,
                  articles (*),
                  client (*),
                  created_at,
                  status,
                  quantity,
                  priceUnit
                  `)
            if (error) {
                console.log(error)
            } else {
              console.log(data)
                setData(data)
            }
        }
        fetchData()
  }, [])

  const handleSwitchAddOrder = () => {
    setSwitchAddOrder(!switchAddOrder)
  }

  const handleSubmitAddOrder = async (e) => {
    e.preventDefault()
    try{
      let clientId
      if (switchAddOrder){
        if (!addOrder.clientName || !addOrder.clientNumber){
          alert("Veuillez remplir tous les champs")
          return
        }
        const { data:addUserData, error } = await supabase
          .from('client')
          .insert([
            {
              name: addOrder.clientName,
              numero: addOrder.clientNumber,
              adresse: addOrder.clientAdresse,
              email: addOrder.clientEmail,
            }
          ]).select()
        if (error) {throw error}
          clientId = addUserData[0].id
        }else{
          clientId = addOrder.client
          if (!clientId){
            alert("Veuillez selectionner un client")
            return
          }
        }

        for(let i = 0; i < orderArticles.items.length; i++){
          if (!orderArticles.items[i].id || !orderArticles.items[i].quantity || !orderArticles.items[i].priceUnit){
            alert("Veuillez remplir tous les champs")
            return
          }
          const { error:orderError } = await supabase
            .from('commandes')
            .insert([
              {
                client: clientId,
                status: addOrder.status,
                article: orderArticles.items[i].id,
                quantity: orderArticles.items[i].quantity,
                priceUnit: orderArticles.items[i].priceUnit,
              }
            ]).select()
          if (orderError) {throw orderError}
          alert("Commande crée avec succès")
          window.location.reload()
        }
      }catch(error){
      console.log(error)
    }
  }

  const handleDeleteOrder = async (item) => {
    console.log(item)
    const { error } = await supabase
      .from('commandes')
      .delete()
      .eq('id', item.id)
    if (error) {
      console.log(error)
    } else {
      alert("Commande supprimée avec succès")
      window.location.reload()
    }
  }

  console.log(data)
  return (
    <div className='flex w-full justify-center '>
        <div className='w-full max-w-[600px] h-screen'>
            <Header title="Commandes" icon="BsCart3" />
            <div className='w-full h-12 flex justify-center items-center fixed max-w-[600px] top-20 px-2'>
                <div className='w-full h-full bg-white rounded-lg flex justify-center items-center shadow-sm shadow-black-20 border '>
                    <input type="text" placeholder='Rechercher un produit' className='w-full h-full rounded-lg px-2 text-sm outline-none' />
                </div>
            </div>
            <div className='w-full h-auto gap-4 flex flex-col justify-center items-center mt-36 px-2 pb-44'>
                {
                    data &&
                    data.map((item, index) => (
                        <div key={index} className='w-full bg-white rounded-lg shadow-sm shadow-black-20 border flex justify-between items-center flex-col'>
                            <div className='w-full flex justify-between items-center p-4 cursor-pointer' onClick={() => handleShowOrder(item)}>
                              <div className='flex flex-col justify-start items-start gap-2 font-Montserrat'>
                                <span className='text-sm font-bold'>{item.client.name}</span>
                                <div className='flex justify-start items-center gap-2 text-xs'>
                                  <icons.MdOutlineDateRange  />
                                  <span className='font-Montserrat'>{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className='text-sm mt-4'>{item.quantity} x {item.articles.name}</span>

                              </div>
                              <div className='flex flex-col justify-center items-end gap-1'>
                                <span className='text-sm font-bold'>{(item.priceUnit * item.quantity).toLocaleString()} Fcfa</span>
                                <div className={'text-sm font-bold py-1 px-2 flex justify-center items-center rounded-full text-white ' + (
                                  item.status === "Terminé" ? "bg-green-500": item.status === "En attente" ? " bg-yellow-500":"bg-red-500")}>{item.status}</div>
                              </div>
                            </div>
                            <div className='w-full flex justify-center items-center mt-4 border-t'>
                              {/* <div className='w-1/2 flex justify-center items-center gap-1 border-r p-2 cursor-pointer ' onClick={() => handleEditOrderClick(item)}>
                                <icons.BiSolidEdit className='text-lg cursor-pointer' />
                                Modifier
                              </div> */}
                              <div className='w-full flex justify-center items-center gap-1 p-2 cursor-pointer ' onClick={() => handleDeleteOrder(item)}>
                                <icons.FaRegTrashAlt className='text-lg cursor-pointer' />
                                Supprimer
                              </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='w-full flex justify-end items-edn h-16 text-xl font-Montserrat fixed max-w-[600px] bottom-20 z-10'>
                <NavLink onClick={handleAddOrderClick} className='w-16 h-16 bg-black rounded-full flex justify-center items-center shadow-sm shadow-black-20 border'>
                    <icons.IoAdd className='text-white' />
                </NavLink>
            </div>
            <Footer />
        </div>
        <div className={'w-full max-w-[600px] fixed bg-black/20 top-0' + (showAddOrder || showDetailOrder ? ' h-screen' : ' h-0') }>

        </div>
        <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showAddOrder ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Ajouter une commande</span>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={handleAddOrderClick} />
                </div>
                <div className='mt-10 w-full'>
                  {
                    switchAddOrder ?
                      <div className='w-full flex flex-col justify-between items-center gap-4 border p-2 rounded-lg'>
                        <label htmlFor="clientName" className='w-full flex flex-col justify-start items-start gap-2'>
                          <div className='w-full flex justify-between items-center'>
                            <span className='font-Montserrat text-sm'>Nom du client</span>
                            <div onClick={handleSwitchAddOrder} className='bg-green-500 text-sm tex-white p-2 rounded-md text-white'>Ancien client</div>
                          </div>
                            <input type="text" value={addOrder.clientName} placeholder='PEZONGO Mickael' name='clientName' onChange={handleChangeAddOrder}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                        <label htmlFor="clientNumber" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Numero du client</span>
                            <input type="text" placeholder='76253037' value={addOrder.clientNumber} name='clientNumber' onChange={handleChangeAddOrder}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                        <label htmlFor="clientAdresse" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Adresse du client</span>
                            <input type="text" placeholder='pissy sect 27' value={addOrder.clientAdresse} name='clientAdresse' onChange={handleChangeAddOrder}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                        <label htmlFor="clientEmail" className='w-full flex flex-col justify-start items-start gap-2'>
                            <span className='font-Montserrat text-sm'>Email du client</span>
                            <input type="text" placeholder='pezongomickael@gmail.com' value={addOrder.clientEmail} name='clientEmail' onChange={handleChangeAddOrder}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                        </label>
                      </div>
                    :
                      <div className='w-full flex flex-col justify-between items-center gap-4 border p-2 rounded-lg'>
                        <label htmlFor="clientName" className='w-full flex flex-col justify-start items-start gap-2'>
                          <div className='w-full flex justify-between items-center'>
                            <span className='font-Montserrat text-sm'>Selectionner le client</span>
                            <div onClick={handleSwitchAddOrder} className='bg-green-500 text-sm tex-white p-2 rounded-md text-white'>Nouveau client</div>
                          </div>
                            <select name="client" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' onChange={(e) => setAddOrder({ ...addOrder, client: e.target.value })}>
                              {
                                clientData && clientData.map((item, index) => (
                                  <option key={index} value={item.id}>{item.name}</option>
                                ))
                              }
                            </select>
                        
                        </label>
                      </div>
                  }
                  <div className='w-full flex justify-center items-center gap-4 mt-4 flex-col border p-2 rounded-lg'>
                      <label htmlFor="articles" className='w-full flex flex-col justify-start items-start gap-2'>
                          <span className='font-Montserrat text-sm'>Articles</span>
                          <select name="id" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'
                            onChange={(event) => setAddOrderArticle({ ...addOrderArticle, id: event.target.value })}>
                            <option value="">Selectionner un article</option>
                            {
                              articlesData && articlesData.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                              ))
                            }
                          </select>
                      </label>
                      <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                          <span className='font-Montserrat text-sm'>Quantité</span>
                          <input type="number" placeholder='1' name='quantity' min={1} onChange={handleSetOrderArticle}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                      </label>
                      <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                          <span className='font-Montserrat text-sm'>Prix unitaire</span>
                          <input type="number" placeholder='1' name='priceUnit' min={1} onChange={handleSetOrderArticle}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                      </label>
                      <button  onClick={() => handleSetOrderArticles(addOrderArticle)} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold'>
                        Ajouter
                      </button>
                      <div className='w-full flex justify-center items-center flex-col'>
                        {
                          orderArticles.items.length > 0 ?

                            orderArticles.items.map((item, index) => (
                              <div key={index} className='w-full text-sm flex justify-between items-center'>
                                {item.quantity} x {articlesData && articlesData.filter(article => article.id === 9)[0].name}
                              </div>
                            ))
                            : 
                            <span className='text-sm font-bold '>Aucun articles</span>
                        }
                      </div>
                  </div>
                  <label htmlFor="status">
                      <span className='font-Montserrat text-sm'>Statut</span>
                      <select name="status" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'
                        onChange={(e) => setAddOrder({ ...addOrder, status: e.target.value })}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                  </label>
                  <button onClick={handleSubmitAddOrder} className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                      Creer la commande
                  </button>
                </div>
            </div>
        </div>
        {/* <div className={'w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000' + (showEditOrder ? ' bottom-0' : ' -bottom-[100%]')}>
            <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                <div className='w-full flex justify-between items-center'>
                    <span className='font-extrabold'>Modifier une commande</span>
                    <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={() => handleEditOrderClick(null)} />
                </div>
                <form action="" className='mt-10 w-full'>
                  <div className='w-full flex flex-col justify-between items-center gap-4 border p-2 rounded-lg'>
                    <label htmlFor="clientName" className='w-full flex flex-col justify-start items-start gap-2'>
                        <span className='font-Montserrat text-sm'>Nom du client</span>
                        <input type="text" value={editOrder.client.name} disabled name='clientName'  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                    </label>
                  </div>
                  <div className='w-full flex justify-center items-center gap-4 mt-4 flex-col border p-2 rounded-lg'>
                      <label htmlFor="articles" className='w-full flex flex-col justify-start items-start gap-2'>
                          <span className='font-Montserrat text-sm'>Articles</span>
                          <select name="quantity" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'>
                            <option value="vetements">Vêtements</option>
                            <option value="chaussures">Chaussures</option>
                            <option value="accessoires">Accessoires</option>
                            <option value="bijoux">Bijoux</option>
                            <option value="autres">Autres</option>
                          </select>
                      </label>
                      <label htmlFor="quantity" className='w-full flex flex-col justify-start items-start gap-2'>
                          <span className='font-Montserrat text-sm'>Quantité</span>
                          <input type="number" placeholder='1' name='quantity' min={1} onChange={handleChangeAddOrder}  className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none' />
                      </label>
                      <button className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold'>
                        Ajouter
                      </button>
                      <div className='w-full flex justify-center items-center gap-4 flex-col'>
                        Aucun articles 
                      </div>
                  </div>
                  <label htmlFor="status">
                      <span className='font-Montserrat text-sm'>Statut</span>
                      <select name="status" id="" className='w-full h-10 bg-gray-100 rounded-lg px-2 text-sm outline-none'>
                        <option value="pending">En attente</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                  </label>
                  <button className='w-full h-10 bg-black rounded-lg text-white font-Montserrat font-bold mt-6'>
                      Creer la commande
                  </button>
                </form>
            </div>
        </div> */}
        {
          showDetailOrder &&
          <div className='w-full z-20 shadow-sm shadow-black-20 flex justify-center items-end border-t h-screen text-xl font-Montserrat fixed max-w-[600px] duration-1000 bottom-0'>
              <div className='w-full h-[80%] overflow-y-auto bg-white rounded-xl flex flex-col justify-start items-start p-4 shadow-sm shadow-black-20 border '>
                  <div className='w-full flex justify-between items-center'>
                      <span className='font-extrabold'>Detail de la commande</span>
                      <icons.IoAdd className='text-2xl rotate-45 cursor-pointer' onClick={() => handleShowOrder(null)} />
                  </div>
                  <div className='flex justify-between items-center w-full mt-4'>
                      <div className='flex flex-col w-1/2 justify-center items-start gap-2'>
                          <span className='text-xl font-bold'>Nom du client</span>
                          <span className='text-sm'>{showDetailOrder.client.name}</span>
                      </div>
                      <div className='flex flex-col w-1/2 justify-center items-end gap-2'>
                        <div className=' text-white text-sm flex flex-col justify-center items-end gap-2 bg-green-500 rounded-lg p-1'>
                          {showDetailOrder.status}
                        </div>
                      </div>
                  </div>
                  <div className='flex flex-col w-full justify-center items-start gap-2 mt-4'>
                      <span className='text-xl font-bold'>Date</span>
                      <span className='text-sm'>{new Date(showDetailOrder.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className='flex flex-col w-full justify-center items-start gap-2 mt-4'>
                    <span className='text-xl font-bold'>Articles</span>
                    <div className='w-full flex justify-center items-center gap-4 flex-col border rounded-lg'>
                      <div className='w-full flex flex-col justify-center items-start gap-2 p-2 border-b'>
                        <div className='w-full flex justify-between items-center'>
                            <div className='flex justify-start items-center gap-2'>
                                <img src={showDetailOrder.articles.img} alt="" className='w-10 h-10 rounded-lg' />
                                <span className='text-sm font-bold'>{showDetailOrder.articles.name}</span>
                            </div>
                            <span className='text-sm font-bold'>{showDetailOrder.articles.price.toLocaleString()} Fcfa</span>
                        </div>
                        <span className='text-xs'>Quantité : {showDetailOrder.quantity}</span>

                      </div>
                      <div className='w-full flex justify-between items-center p-4'>
                          <span className='text-xl font-bold'>Total</span>
                          <span className='text-sm font-bold'>{(showDetailOrder.articles.price * showDetailOrder.quantity).toLocaleString()} Fcfa</span>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        }
    </div>
  )
}

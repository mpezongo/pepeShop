import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import Footer from '../component/Footer'
import icons from '../constant/icons'
import { NavLink } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabase = createClient(
  "https://alnyevekfotvgurlshew.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbnlldmVrZm90dmd1cmxzaGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTA2MjgsImV4cCI6MjA1ODkyNjYyOH0.TuI3kmlRPsCTZbzl_ucv6Ehd7RSfG5HHq6V_f0zDKp0"
);

export default function Home() {

    const [articles, setArticles] = useState([])
    const [depenses, setDepenses] = useState([])
    const [ventes, setVentes] = useState([])

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                if (error) {
                    throw error
                }
                setArticles(data)
            } catch (error) {
                console.error('Error fetching articles:', error)
            }
        }

        const fetchDepenses = async () => {
            try {
                const { data, error } = await supabase
                    .from('depenses')
                    .select('*')
                if (error) {
                    throw error
                }
                setDepenses(data)
            } catch (error) {
                console.error('Error fetching depenses:', error)
            }
        }

        const fetchVentes = async () => {
            try {
                const { data, error } = await supabase
                    .from('commandes')
                    .select('*, articles(*)')
                if (error) {
                    throw error
                }
                setVentes(data)
            } catch (error) {
                console.error('Error fetching ventes:', error)
            }
        }

        fetchArticles()
        fetchDepenses()
        fetchVentes()
    }, [])

    function formatNumber(value) {
        if (value >= 1_000_000) {
                return (value / 1_000_000).toFixed(2) + 'M';
        } else if (value >= 1_000) {
                return (value / 1_000).toFixed(2) + 'K';
        }
        return value.toLocaleString();
    }

    const totalArticles = articles.reduce((acc, article) => acc + article.quantity, 0)
    const totalBuyNbr = articles.reduce((acc, article) => acc + article.buyNbr, 0)
    const totalInventoryValue = articles.reduce((acc, article) => acc + (article.price * (article.type === "ballot" ? 1 : article.quantity)), 0)
    const totalDepenses = depenses.reduce((acc, depense) => acc + depense.montant, 0)
    const totalVentes = ventes.reduce((acc, vente) => acc + vente.priceUnit * vente.quantity, 0)

    console.log("Total ventes: ", totalInventoryValue)

  return (
    <div className='flex w-full justify-center '>
        <div className='w-full max-w-[600px] h-screen'>
            <Header title="Tableau de bord" icon="MdOutlineDashboard" />
            <div className='w-full grid grid-cols-2 gap-4 p-2 mt-20'>
                <NavLink to='/inventory' className='w-full h-auto py-4 px-4 bg-white shadow-sm shadow-black-20 border rounded-lg gap-2 flex flex-col justify-center items-center font-Montserrat text-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center'>
                        <icons.PiCubeDuotone className='text-2xl' />
                    </div>
                    <span className='text-sm'>Valeur de stock</span>
                    <span className='font-extrabold text-xl'>{formatNumber(totalInventoryValue)} Fcfa</span>
                    <span className='text-sm'>Articles Achete: {totalArticles.toLocaleString()}</span>
                    <span className='text-sm'>Stock: {(totalArticles - totalBuyNbr).toLocaleString()}</span>
                </NavLink>
                <NavLink to='/order' className='w-full h-auto py-4 px-4 bg-white shadow-sm shadow-black-20 border rounded-lg gap-2 flex flex-col justify-center items-center font-Montserrat text-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center'>
                        <icons.BsCart3 className='text-2xl' />
                    </div>
                    <span className='text-sm'>Ventes</span>
                    <span className='font-extrabold text-xl'>{totalVentes.toLocaleString()} Fcfa</span>
                    <span className='text-sm'>{ventes && ventes.length} commandes</span>
                </NavLink>
                <NavLink to='/depenses' className='w-full h-auto py-4 px-4 bg-white shadow-sm shadow-black-20 border rounded-lg gap-2 flex flex-col justify-center items-center font-Montserrat text-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center'>
                        <icons.LuCreditCard className='text-2xl' />
                    </div>
                    <span className='text-sm'>Depenses</span>
                    <span className='font-extrabold text-xl'>{totalDepenses.toLocaleString()} Fcfa</span>
                    <span className='text-sm'>{depenses && depenses.length.toLocaleString()} Depenses</span>
                </NavLink>
                <NavLink className='w-full h-auto py-4 px-4 bg-white shadow-sm shadow-black-20 border rounded-lg gap-2 flex flex-col justify-center items-center font-Montserrat text-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center'>
                        <icons.HiArrowTrendingUp className='text-2xl' />
                    </div>
                    <span className='text-sm'>Profit</span>
                    <span className={'font-extrabold text-xl text-green-500 ' + (totalVentes - totalDepenses > 0 ? "text-green-500":"text-red-500")}>{(totalVentes - totalDepenses).toLocaleString()} Fcfa</span>
                    {/* <span className='text-sm'>0 en attente</span> */}
                </NavLink>
            </div>
            <Footer />
        </div>
    </div>
  )
}

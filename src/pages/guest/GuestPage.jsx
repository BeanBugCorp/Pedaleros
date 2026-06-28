import { useState } from 'react'
import {
  useEventSalesSummary,
  useSortedPairs,
  useCategories,
} from '../../hooks/useGuestData'
import PageHeader from '../../components/guest/PageHeader/PageHeader'
import ToteBoard from '../../components/guest/ToteBoard/ToteBoard'
import PairRow from '../../components/guest/PairRow/PairRow'
import CategorySection from '../../components/guest/CategorySection/CategorySection'
import PageFooter from '../../components/guest/PageFooter/PageFooter'
import PairModal from '../../components/guest/PairModal/PairModal'
import CategoryModal from '../../components/guest/CategoryModal/CategoryModal'
import SearchOverlay from '../../components/guest/SearchOverlay/SearchOverlay'
import './GuestPage.css'

// TODO: source this from routing/props once events are selectable.
const EVENT_ID = 'e610f10c-9aad-401f-b5bc-06bce2df9439'

export default function GuestPage() {
  const [selectedCat, setSelectedCat] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [modalPair, setModalPair] = useState(null)
  const [modalOnBack, setModalOnBack] = useState(null)

  const { totalSales, maxSale, numPairs } = useEventSalesSummary(EVENT_ID)
  const { sortedPairs } = useSortedPairs(EVENT_ID)
  const { categories } = useCategories(EVENT_ID)

  const categoryNames = categories.map((c) => c.name)
  const activeCat = selectedCat ?? categoryNames[0] ?? null
  const sortedAll = sortedPairs
  const topPairs = sortedAll.slice(0, 5)
  const catPairs = sortedAll.filter((p) => p.categoria === activeCat)

  const openModal = (pair) => {
    setModalPair(pair)
    setModalOnBack(null)
  }
  const closeModal = () => {
    setModalPair(null)
    setModalOnBack(null)
  }

  return (
    <div className="app-layout">
      <div className="page">
        <PageHeader onSearchOpen={() => setSearchOpen(true)} />

        <ToteBoard
          totalSales={totalSales}
          maxSale={maxSale}
          numPairs={numPairs}
        />

        <div className="section-title">Top 5 Global</div>
        <div className="rows">
          {topPairs.map((p, i) => (
            <PairRow
              key={p.id}
              rank={i + 1}
              pareja={p.pareja}
              categoria={p.categoria}
              grupo={p.grupo}
              amount={p.amount}
              leader={i === 0}
              onClick={() => openModal(p)}
              glowDelay={i * 1.5}
              glowDuration={7.5}
            />
          ))}
        </div>

        <CategorySection
          activeCat={activeCat}
          categoryNames={categoryNames}
          catPairs={catPairs}
          dropdownOpen={dropdownOpen}
          onDropdownToggle={() => setDropdownOpen((o) => !o)}
          onSelectCat={(cat) => {
            setSelectedCat(cat)
            setDropdownOpen(false)
          }}
          onOpenModal={openModal}
          onOpenCatModal={() => setCatModalOpen(true)}
        />
      </div>

      <PageFooter />

      {searchOpen && (
        <SearchOverlay
          sortedAll={sortedAll}
          onClose={() => setSearchOpen(false)}
          onSelectPair={(pair) => {
            setSearchOpen(false)
            setModalPair(pair)
          }}
        />
      )}

      {catModalOpen && (
        <CategoryModal
          categoria={activeCat}
          catPairs={catPairs}
          onClose={() => setCatModalOpen(false)}
          onSelectPair={(p) => {
            setCatModalOpen(false)
            setModalPair(p)
            setModalOnBack(() => () => {
              setModalPair(null)
              setCatModalOpen(true)
            })
          }}
        />
      )}

      {modalPair && (
        <PairModal pair={modalPair} onClose={closeModal} onBack={modalOnBack} />
      )}
    </div>
  )
}

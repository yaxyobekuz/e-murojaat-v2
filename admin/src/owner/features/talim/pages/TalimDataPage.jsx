// Ta'lim — Umumiy ma'lumotlar (alohida sahifa). Muassasa drill-down + o'quvchilar + hodimlar.
import { useState } from "react";
import { useInjectCC, CcTop, T } from "../cc";
import { M, INST } from "../data";
import { InstitutionCard, InstitutionModal, StudentsBlock, StaffBlock } from "../sections";

const TalimDataPage = () => {
  useInjectCC();
  const [openInst, setOpenInst] = useState(null);
  return (
    <div className="tcc">
      <CcTop title="Umumiy ma'lumotlar — Ta'lim" subtitle={`${M.name} · ${M.area}`} />
      <div className="tcc-wrap">
        <div className="tcc-h2">Muassasalar</div>
        <div className="tcc-inst" style={{ marginBottom: 14 }}>{INST.map((it, i) => <InstitutionCard key={it.id} inst={it} delay={i * 80} onOpen={() => setOpenInst(it)} />)}</div>
        <div className="tcc-h2">O'quvchilar</div>
        <div className="tcc-grid" style={{ marginBottom: 14 }}><StudentsBlock /></div>
        <div className="tcc-h2">Hodimlar</div>
        <div className="tcc-grid"><StaffBlock /></div>
        <div style={{ marginTop: 16, fontSize: 11.5, color: T.muted }}>Barcha ma'lumotlar — <b>namunaviy (sintetik)</b>.</div>
      </div>
      {openInst && <InstitutionModal inst={openInst} onClose={() => setOpenInst(null)} />}
    </div>
  );
};
export default TalimDataPage;

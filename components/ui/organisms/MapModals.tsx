import React from 'react';
import { POIFormModal } from '../molecules/POIFormModal';
import { POI } from '../../../types/map';

interface MapModalsProps {
  showSaveModal: boolean;
  setShowSaveModal: (show: boolean) => void;
  setTempLocation: (loc: any) => void;
  newPOIForm: any;
  setNewPOIForm: (fn: any) => void;
  savePOI: () => void;
  isSaving: boolean;
  POI_CATEGORIES: string[];
  
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedPOI: POI | null;
  editForm: any;
  setEditForm: (fn: any) => void;
  saveManualPOI: () => void;
}

export function MapModals({
  showSaveModal, setShowSaveModal, setTempLocation,
  newPOIForm, setNewPOIForm, savePOI, isSaving, POI_CATEGORIES,
  showEditModal, setShowEditModal, selectedPOI,
  editForm, setEditForm, saveManualPOI
}: MapModalsProps) {
  return (
    <>
      {/* Save POI Modal */}
      {showSaveModal && (
        <POIFormModal
          visible={showSaveModal}
          onClose={() => {
            setShowSaveModal(false);
            setTempLocation(null);
          }}
          isEditMode={false}
          formData={newPOIForm}
          onChangeText={(field: string, text: string) => setNewPOIForm((prev: any) => ({ ...prev, [field]: text }))}
          onSave={savePOI}
          isSaving={isSaving}
          categories={POI_CATEGORIES}
        />
      )}

      {/* Edit POI Modal */}
      {showEditModal && selectedPOI && (
        <POIFormModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          isEditMode={true}
          formData={editForm}
          onChangeText={(field: string, text: string) => setEditForm((prev: any) => ({ ...prev, [field]: text }))}
          onSave={saveManualPOI}
          isSaving={isSaving}
          categories={POI_CATEGORIES}
        />
      )}
    </>
  );
}
